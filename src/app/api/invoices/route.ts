import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search') || '';

    const invoices = await prisma.invoice.findMany({
      where: searchQuery ? {
        OR: [
          { clientName: { contains: searchQuery } },
          { status: { contains: searchQuery } },
          { description: { contains: searchQuery } },
        ],
      } : {},
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(invoices);
  } catch (error: any) {
    console.error('Failed to read invoices:', error);
    return NextResponse.json({ message: 'Failed to load invoices.', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let invoiceData;
    try {
      invoiceData = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    // Validate required fields
    if (!invoiceData.clientName || !invoiceData.amount || !invoiceData.status) {
      return NextResponse.json({ 
        message: 'Missing required fields: clientName, amount, and status are required.' 
      }, { status: 400 });
    }

    // Ensure amount is a valid number
    const amount = parseFloat(invoiceData.amount);
    if (isNaN(amount)) {
      return NextResponse.json({ 
        message: 'Amount must be a valid number.' 
      }, { status: 400 });
    }

    const createdInvoice = await prisma.invoice.create({ 
      data: {
        clientName: invoiceData.clientName,
        amount: amount,
        status: invoiceData.status,
        dueDate: invoiceData.dueDate || null,
        description: invoiceData.description || null,
      }
    });
    
    return NextResponse.json({ 
      message: 'Invoice created successfully.', 
      invoice: createdInvoice 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create invoice:', error);
    return NextResponse.json({ message: 'Failed to create invoice.', error: error.message }, { status: 500 });
  }
}