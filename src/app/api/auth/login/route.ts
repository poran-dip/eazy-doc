// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json()

    // Validate role
    if (!['patient', 'doctor', 'admin'].includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role' 
      }, { status: 400 })
    }

    let user;

    if (role === 'patient') {
    user = await prisma.patient.findUnique({
        where: { email }
    });
    } else if (role === 'doctor') {
    user = await prisma.doctor.findUnique({
        where: { email }
    });
    } else {
    user = await prisma.admin.findUnique({
        where: { email }
    });
    }

    if (!user) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ 
        error: 'Invalid credentials' 
      }, { status: 401 })
    }

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set(`${role}Id`, user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    })

    return NextResponse.json({ 
      message: 'Login successful', 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      error: 'An error occurred during login' 
    }, { status: 500 })
  }
}