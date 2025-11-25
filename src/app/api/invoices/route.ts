import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search') || '';

    const invoices = await prisma.invoice.findMany({
      where: {
        OR: [
          { clientName: { contains: searchQuery } },
          { status: { contains: searchQuery } },
        ],
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
    const newInvoice = await request.json();

    if (!newInvoice.clientName || typeof newInvoice.clientName !== 'string' || newInvoice.clientName.trim() === '') {
      return NextResponse.json({ message: 'Invalid client name.' }, { status: 400 });
    }

    if (typeof newInvoice.amount !== 'number' || newInvoice.amount < 0) {
      return NextResponse.json({ message: 'Invalid amount.' }, { status: 400 });
    }

    if (newInvoice.status !== 'pending' && newInvoice.status !== 'paid') {
      return NextResponse.json({ message: 'Invalid status.' }, { status: 400 });
    }

    const createdInvoice = await prisma.invoice.create({ data: newInvoice });
    return NextResponse.json({ message: 'Invoice created successfully.', invoice: createdInvoice }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create invoice:', error);
    return NextResponse.json({ message: 'Failed to create invoice.', error: error.message }, { status: 500 });
  }
}