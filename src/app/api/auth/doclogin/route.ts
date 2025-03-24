// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find the doctor by email
    const doctor = await prisma.doctor.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        specialization: true,
      },
    });

    // Check if doctor exists
    if (!doctor) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password (assuming passwords are hashed in the database)
    const passwordMatch = await bcrypt.compare(password, doctor.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return doctor data without password
    const { password: _, ...doctorWithoutPassword } = doctor;
    
    return NextResponse.json({
      message: 'Login successful',
      doctor: doctorWithoutPassword
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}