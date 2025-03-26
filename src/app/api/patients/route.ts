// app/api/patients/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Simplified Validation Schema
const PatientCreateSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  age: z.number().int().optional(),
  gender: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const patients = await prisma.patient.findMany({
      include: { 
        user: true,
        appointments: {
          include: {
            doctor: {
              include: { user: true }
            }
          },
          orderBy: { dateTime: 'desc' }
        }
      }
    })

    return NextResponse.json(patients)
  } catch (error) {
    console.error('Patients fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch patients',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json()
    const validatedData = PatientCreateSchema.parse(rawData)

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

    const patient = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name,
          role: 'PATIENT'
        }
      })

      return tx.patient.create({
        data: {
          userId: user.id,
          age: validatedData.age,
          gender: validatedData.gender
        },
        include: { 
          user: true,
          appointments: true
        }
      })
    })

    return NextResponse.json(patient, { status: 201 })
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

    console.error('Patient creation error:', error)
    return NextResponse.json({ 
      error: 'Failed to create patient',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}