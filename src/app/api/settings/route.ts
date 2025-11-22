import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function GET(request: Request) {
  try {
    // Extract username from query params or headers
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ message: 'Username is required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true, email: true, fullName: true, preferences: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Failed to fetch user settings:', error);
    return NextResponse.json({ message: 'Failed to fetch user settings.', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { username, email, fullName, preferences } = body;

    if (!username) {
      return NextResponse.json({ message: 'Username is required.' }, { status: 400 });
    }

    // Find user by username
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email },
      });
      if (emailTaken) {
        return NextResponse.json({ message: 'Email already in use.' }, { status: 409 });
      }
    }

    // Update user settings
    const updatedUser = await prisma.user.update({
      where: { username },
      data: { 
        email: email || existingUser.email, 
        fullName: fullName !== undefined ? fullName : existingUser.fullName, 
        preferences: preferences !== undefined ? preferences : existingUser.preferences 
      },
      select: { id: true, username: true, email: true, fullName: true, preferences: true },
    });

    return NextResponse.json({ 
      message: 'User settings updated successfully.', 
      user: updatedUser 
    });
  } catch (error: any) {
    console.error('Failed to update user settings:', error);
    return NextResponse.json({ message: 'Failed to update user settings.', error: error.message }, { status: 500 });
  }
}