import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function POST() {
  try {
    await prisma.client.createMany({
      data: [
        { name: 'Acme Corp', email: 'info@acmecorp.com', address: '123 Main St, Anytown USA' },
        { name: 'Globex Inc.', email: 'contact@globex.com', address: '456 Oak Ave, Somewhere CA' },
        { name: 'Soylent Corp', email: 'sales@soylentcorp.com', address: '789 Pine Ln, Nowhere NY' },
      ],
    });
    return NextResponse.json({ message: 'Clients seeded successfully.' }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to seed clients:', error);
    return NextResponse.json({ message: 'Failed to seed clients.', error: error.message }, { status: 500 });
  }
}