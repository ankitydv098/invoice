import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../prisma/client';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json({ message: 'Invoice ID is required.' }, { status: 400 });
    }

    const invoice = await prisma.invoice.findUnique({ where: { id } });
    
    if (!invoice) {
      return NextResponse.json({ message: 'Invoice not found.' }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error: any) {
    console.error('Failed to read invoice:', error);
    return NextResponse.json({ message: 'Failed to load invoice.', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json({ message: 'Invoice ID is required.' }, { status: 400 });
    }

    let updatedInvoiceData;
    try {
      updatedInvoiceData = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
    }

    // Validate amount if provided
    if (updatedInvoiceData.amount !== undefined) {
      const amount = parseFloat(updatedInvoiceData.amount);
      if (isNaN(amount)) {
        return NextResponse.json({ 
          message: 'Amount must be a valid number.' 
        }, { status: 400 });
      }
      updatedInvoiceData.amount = amount;
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        clientName: updatedInvoiceData.clientName,
        amount: updatedInvoiceData.amount,
        status: updatedInvoiceData.status,
        dueDate: updatedInvoiceData.dueDate,
        description: updatedInvoiceData.description,
      },
    });

    return NextResponse.json({ 
      message: 'Invoice updated successfully.', 
      invoice 
    });
  } catch (error: any) {
    console.error('Failed to update invoice:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Invoice not found.' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Failed to update invoice.', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json({ message: 'Invoice ID is required.' }, { status: 400 });
    }

    await prisma.invoice.delete({ where: { id } });
    
    return NextResponse.json({ message: 'Invoice deleted successfully.' });
  } catch (error: any) {
    console.error('Failed to delete invoice:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Invoice not found.' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Failed to delete invoice.', error: error.message }, { status: 500 });
  }
}