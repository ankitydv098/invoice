import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (invoice) {
      return NextResponse.json(invoice);
    } else {
      return NextResponse.json({ message: 'Invoice not found.' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Failed to read invoice:', error);
    return NextResponse.json({ message: 'Failed to load invoice.', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const updatedInvoiceData = await request.json();

    if (updatedInvoiceData.clientName && (typeof updatedInvoiceData.clientName !== 'string' || updatedInvoiceData.clientName.trim() === '')) {
      return NextResponse.json({ message: 'Invalid client name.' }, { status: 400 });
    }

    if (updatedInvoiceData.amount !== undefined && (typeof updatedInvoiceData.amount !== 'number' || updatedInvoiceData.amount < 0)) {
      return NextResponse.json({ message: 'Invalid amount.' }, { status: 400 });
    }

    if (updatedInvoiceData.status && updatedInvoiceData.status !== 'pending' && updatedInvoiceData.status !== 'paid') {
      return NextResponse.json({ message: 'Invalid status.' }, { status: 400 });
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updatedInvoiceData,
    });
    if (invoice) {
      return NextResponse.json({ message: 'Invoice updated successfully.' });
    } else {
      return NextResponse.json({ message: 'Invoice not found.' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Failed to update invoice:', error);
    return NextResponse.json({ message: 'Failed to update invoice.', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const invoice = await prisma.invoice.delete({ where: { id } });
    if (invoice) {
      return NextResponse.json({ message: 'Invoice deleted successfully.' });
    } else {
      return NextResponse.json({ message: 'Invoice not found.' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Failed to delete invoice:', error);
    return NextResponse.json({ message: 'Failed to delete invoice.', error: error.message }, { status: 500 });
  }
}