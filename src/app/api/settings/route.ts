import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getDefaultUser() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        username: 'default_user',
        password: 'default_password', // In a real app, this would be hashed
        email: 'user@example.com',
        fullName: 'Default User',
        preferences: {},
      },
    });
  }
  return user;
}

export async function GET(request: Request) {
  try {
    const user = await getDefaultUser();
    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Failed to fetch user settings:', error);
    return NextResponse.json({ message: 'Failed to fetch user settings.', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getDefaultUser();
    const { email, fullName, preferences } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { email, fullName, preferences },
      select: { username: true, email: true, fullName: true, preferences: true },
    });

    return NextResponse.json({ message: 'User settings updated successfully.', user: updatedUser });
  } catch (error: any) {
    console.error('Failed to update user settings:', error);
    return NextResponse.json({ message: 'Failed to update user settings.', error: error.message }, { status: 500 });
  }
}