// app/api/doctors/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Simplified Validation Schema
const DoctorCreateSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  specialization: z.string(),
  license: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const doctors = await prisma.doctor.findMany({
      include: { 
        user: true,
        appointments: {
          include: {
            patient: {
              include: { user: true }
            }
          },
          orderBy: { dateTime: 'desc' }
        },
        ratings: true
      }
    })

    return NextResponse.json(doctors)
  } catch (error) {
    console.error('Doctors fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch doctors',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json()
    const validatedData = DoctorCreateSchema.parse(rawData)

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json({ 
        error: 'Email already exists',
        field: 'email'
      }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    const doctor = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name,
          role: 'DOCTOR'
        }
      })

      return tx.doctor.create({
        data: {
          userId: user.id,
          specialization: validatedData.specialization,
          license: validatedData.license,
          verified: false
        },
        include: { 
          user: true,
          appointments: true,
          ratings: true
        }
      })
    })

    return NextResponse.json(doctor, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message
        }))
      }, { status: 400 })
    }

    console.error('Doctor creation error:', error)
    return NextResponse.json({ 
      error: 'Failed to create doctor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}