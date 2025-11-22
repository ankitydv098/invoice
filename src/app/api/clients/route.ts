import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(clients);
  } catch (error: any) {
    console.error('Failed to fetch clients:', error);
    return NextResponse.json({ message: 'Failed to fetch clients.', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { name, email, address } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ 
        message: 'Name and email are required fields.' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        message: 'Invalid email format.' 
      }, { status: 400 });
    }

    // Check if email already exists
    const existingClient = await prisma.client.findUnique({
      where: { email },
    });

    if (existingClient) {
      return NextResponse.json({ 
        message: 'A client with this email already exists.' 
      }, { status: 409 });
    }

    const newClient = await prisma.client.create({
      data: {
        name,
        email,
        address: address || null,
      },
    });
    
    return NextResponse.json(newClient, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create client:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        message: 'A client with this email already exists.' 
      }, { status: 409 });
    }
    
    return NextResponse.json({ message: 'Failed to create client.', error: error.message }, { status: 500 });
  }
}