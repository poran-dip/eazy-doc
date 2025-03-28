import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

// Patient Update Schema
const PatientUpdateSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  age: z.number().optional(),
  gender: z.string().optional()
})

type PrismaError = Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientUnknownRequestError

export async function GET(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          include: {
            doctor: true,
            ambulance: true
          },
          orderBy: {
            dateTime: 'desc'
          }
        }
      }
    })

    if (!patient) {
      return NextResponse.json({ 
        error: 'Patient not found' 
      }, { status: 404 })
    }

    return NextResponse.json(patient)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        code: error.code
      }, { status: 400 })
    }
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await req.json()

    const validation = PatientUpdateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error.errors 
      }, { status: 400 })
    }

    const patient = await prisma.patient.update({
      where: { id },
      data: validation.data,
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        gender: true,
        image: true,
        // createdAt: true,
        // updatedAt: true
      }
    })

    return NextResponse.json(patient)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ 
          error: 'Patient not found' 
        }, { status: 404 })
      }
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        code: error.code
      }, { status: 400 })
    }
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Use transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      await tx.appointment.deleteMany({
        where: { patientId: id }
      })

      await tx.patient.delete({
        where: { id }
      })
    })

    return NextResponse.json({ 
      message: 'Patient and associated appointments deleted successfully' 
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ 
          error: 'Patient not found' 
        }, { status: 404 })
      }
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        code: error.code
      }, { status: 400 })
    }
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}