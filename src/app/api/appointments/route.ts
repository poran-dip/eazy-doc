import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

// Appointment Validation Schema
const AppointmentSchema = z.object({
  patientId: z.string(),
  doctorId: z.string().optional(),
  ambulanceId: z.string().optional(),
  dateTime: z.string().datetime().optional(),
  condition: z.string().optional(),
  specialization: z.string().optional(),
  status: z.enum(['NEW', 'PENDING', 'COMPLETED', 'CANCELED', 'EMERGENCY']).optional(),
  comments: z.string().optional(),
  description: z.string().optional(),
  prescriptions: z.array(z.string()).optional(),
  tests: z.array(z.string()).optional(),
  relatedAppointmentId: z.string().optional()
})

type PrismaError = Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientUnknownRequestError

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validation = AppointmentSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error.errors 
      }, { status: 400 })
    }

    const appointment = await prisma.appointment.create({
      data: {
        patient: { connect: { id: body.patientId } },
        ...(body.doctorId && { doctor: { connect: { id: body.doctorId } } }),
        ...(body.ambulanceId && { ambulance: { connect: { id: body.ambulanceId } } }),
        ...(body.relatedAppointmentId && { 
          relatedTo: { connect: { id: body.relatedAppointmentId } } 
        }),
        dateTime: body.dateTime ? new Date(body.dateTime) : undefined,
        condition: body.condition,
        specialization: body.specialization,
        status: body.status || 'NEW',
        comments: body.comments,
        description: body.description,
        prescriptions: body.prescriptions,
        tests: body.tests
      },
      include: {
        patient: true,
        doctor: true,
        ambulance: true,
        relatedAppointments: true,
        relatedTo: true
      }
    })

    return NextResponse.json(appointment, { status: 201 })
<<<<<<< HEAD
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ 
          error: 'This appointment slot is already taken'
        }, { status: 409 })
      }
      if (error.code === 'P2025') {
        return NextResponse.json({ 
          error: 'Referenced record not found'
        }, { status: 404 })
      }
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        code: error.code
      }, { status: 400 })
    }
    return NextResponse.json({ 
      error: 'Internal server error'
=======
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'an unknown error occurred'
    return NextResponse.json({ 
      error: errorMessage 
>>>>>>> 5a1d428 (build errors half fixed)
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: true,
        ambulance: true,
        relatedAppointments: true,
        relatedTo: true
      }
    })
    return NextResponse.json(appointments)
<<<<<<< HEAD
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        code: error.code
      }, { status: 400 })
    }
    return NextResponse.json({ 
      error: 'Internal server error'
=======
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'an unknown error occurred'
    return NextResponse.json({ 
      error: errorMessage 
>>>>>>> 5a1d428 (build errors half fixed)
    }, { status: 500 })
  }
}