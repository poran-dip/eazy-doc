import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

// Doctor Update Schema
const DoctorUpdateSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  specialization: z.string().optional(),
  status: z.enum(['AVAILABLE', 'ON_DUTY', 'OFF_DUTY', 'UNAVAILABLE']).optional(),
  rating: z.number().optional()
})

type PrismaError = Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientUnknownRequestError

export async function GET(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        appointments: {
          include: {
            patient: true,
            ambulance: true
          },
          orderBy: {
            dateTime: 'desc'
          }
        }
      }
    })

    if (!doctor) {
      return NextResponse.json({ 
        error: 'Doctor not found' 
      }, { status: 404 })
    }

    return NextResponse.json(doctor)
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

    const validation = DoctorUpdateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error.errors 
      }, { status: 400 })
    }

    const doctor = await prisma.doctor.update({
      where: { id },
      data: validation.data
    })

    return NextResponse.json(doctor)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ 
          error: 'Doctor not found' 
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
      // First update appointments
      await tx.appointment.updateMany({
        where: { doctorId: id },
        data: { doctorId: null }
      })

      // Then delete the doctor
      await tx.doctor.delete({
        where: { id }
      })
    })

    return NextResponse.json({ 
      message: 'Doctor deleted successfully. Associated appointments updated.' 
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ 
          error: 'Doctor not found' 
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