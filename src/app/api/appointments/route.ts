// app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Simplified Validation Schema
const AppointmentCreateSchema = z.object({
  patientId: z.string(),
  doctorId: z.string().optional(),
  dateTime: z.string().datetime().optional(),
  status: z.enum(['NEW', 'PENDING', 'COMPLETED', 'CANCELED', 'EMERGENCY']).optional(),
  condition: z.string().optional(),
  description: z.string().optional(),
  specialization: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get('doctorId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const whereClause: any = {}

    if (doctorId) {
      whereClause.doctorId = doctorId
    }

    if (startDate && endDate) {
      whereClause.dateTime = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: {
          include: { user: true }
        },
        doctor: {
          include: { user: true }
        },
        prescriptions: true,
        tests: true
      },
      orderBy: { dateTime: 'desc' }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Appointments fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch appointments',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json()
    const validatedData = AppointmentCreateSchema.parse(rawData)

    // Validate patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: validatedData.patientId }
    })

    if (!patient) {
      return NextResponse.json({ 
        error: 'Patient not found',
        field: 'patientId'
      }, { status: 404 })
    }

    // Optional doctor validation
    if (validatedData.doctorId) {
      const doctor = await prisma.doctor.findUnique({
        where: { id: validatedData.doctorId }
      })
      if (!doctor) {
        return NextResponse.json({ 
          error: 'Doctor not found',
          field: 'doctorId'
        }, { status: 404 })
      }
    }

    const appointment = await prisma.appointment.create({
      data: {
        ...validatedData,
        status: validatedData.status || 'NEW',
        dateTime: validatedData.dateTime ? new Date(validatedData.dateTime) : undefined,
        specialization: validatedData.specialization
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        prescriptions: true,
        tests: true
      }
    })

    return NextResponse.json(appointment, { status: 201 })
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

    console.error('Appointment creation error:', error)
    return NextResponse.json({ 
      error: 'Failed to create appointment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}