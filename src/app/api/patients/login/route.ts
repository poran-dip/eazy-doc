import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const patient = await prisma.patient.findUnique({
      where: { email },
    });

    if (!patient) {
      return NextResponse.json({ message: 'Doctor not found' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'OK',
      doctorId: patient.id,
      email: patient.email,
      role: 'patient'
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}