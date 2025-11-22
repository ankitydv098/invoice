import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { username, password, email, fullName } = body;

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (existingUser) {
      return NextResponse.json({ message: 'Username already exists' }, { status: 409 });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email: email || null,
        fullName: fullName || null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ 
      message: 'User registered successfully', 
      user: newUser 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      message: 'Registration failed', 
      error: error.message 
    }, { status: 500 });
  }
}