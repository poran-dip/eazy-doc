// app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

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
      }
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
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
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}