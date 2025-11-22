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

    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password required' }, { status: 400 });
    }

    // Try to find user in database
    const user = await prisma.user.findUnique({ 
      where: { username },
      select: { id: true, username: true, password: true, email: true, fullName: true }
    });

    // If user exists, verify password
    if (user) {
      // Check if password is hashed (starts with $2b$ for bcrypt)
      let isValidPassword = false;
      
      if (user.password.startsWith('$2')) {
        // Hashed password - use bcrypt compare
        isValidPassword = await bcrypt.compare(password, user.password);
      } else {
        // Plain text password (for backwards compatibility)
        isValidPassword = password === user.password;
      }

      if (isValidPassword) {
        return NextResponse.json({ 
          message: 'Login successful', 
          user: { 
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName
          } 
        }, { status: 200 });
      }
    }

    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Login failed', error: error.message }, { status: 500 });
  }
}