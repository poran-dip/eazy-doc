import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
<<<<<<< HEAD
import { Prisma } from '@prisma/client'
=======
>>>>>>> 5a1d428 (build errors half fixed)

// Patient Validation Schema
const PatientSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  image: z.string().optional(),
  age: z.number().optional(),
  gender: z.string().optional()
})

type PrismaError = Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientUnknownRequestError

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validation = PatientSchema.safeParse(body)

    if (!validation.success) {
      const formattedErrors = validation.error.errors.map(err => err.message).join(', ')
      return NextResponse.json({ 
        error: `Invalid input: ${formattedErrors}` 
      }, { status: 400 })
    }

    const existingPatient = await prisma.patient.findUnique({
      where: { email: body.email }
    })

    if (existingPatient) {
      return NextResponse.json({ 
        error: 'Email already in use' 
      }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const patient = await prisma.patient.create({
      data: {
        ...validation.data,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        gender: true,
        image: true,
        // createdAt: true, // Removed as it does not exist in PatientSelect
        // updatedAt: true // Removed as it does not exist in PatientSelect
      }
    })

    return NextResponse.json(patient, { status: 201 })
<<<<<<< HEAD
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ 
          error: 'A patient with this email already exists' 
        }, { status: 409 })
      }
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        code: error.code
      }, { status: 400 })
=======
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('patient registration error:', error.message)
    } else {
        console.error('patient registration error:', error)
>>>>>>> 5a1d428 (build errors half fixed)
    }
    console.error('Patient registration error:', error)
    return NextResponse.json({ 
      error: 'Unable to complete registration. Please try again later.' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        gender: true,
        image: true,
        appointments: {
          include: {
            doctor: {
              select: {
                id: true,
                name: true,
                specialization: true
              }
            }
          },
          orderBy: {
            dateTime: 'asc'
          }
        }
      }
    })
    return NextResponse.json(patients)
<<<<<<< HEAD
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        code: error.code
      }, { status: 400 })
    }
    return NextResponse.json({ 
      error: 'Failed to fetch patients' 
=======
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'an unknown error occurred'
    return NextResponse.json({ 
      error: errorMessage 
>>>>>>> 5a1d428 (build errors half fixed)
    }, { status: 500 })
  }
}