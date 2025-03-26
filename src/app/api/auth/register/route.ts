// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json()

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        // Conditionally create related profile based on role
        ...(role === 'PATIENT' && { patient: { create: {} } }),
        ...(role === 'DOCTOR' && { doctor: { create: { specialization: '' } } }),
        ...(role === 'AMBULANCE' && { ambulance: { create: {} } }),
        ...(role === 'ADMIN' && { admin: { create: {} } })
      }
    })

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}