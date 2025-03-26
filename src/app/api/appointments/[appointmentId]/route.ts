// app/api/appointments/[appointmentId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Simplified Validation Schema
const AppointmentUpdateSchema = z.object({
  patientId: z.string().optional(),
  doctorId: z.string().optional(),
  dateTime: z.string().datetime().optional(),
  status: z.enum(['NEW', 'PENDING', 'COMPLETED', 'CANCELED', 'EMERGENCY']).optional(),
  condition: z.string().optional(),
  description: z.string().optional(),
  specialization: z.string().optional(),
  
  prescriptions: z.array(z.object({
    medication: z.string(),
    dosage: z.string(),
    instructions: z.string().optional()
  })).optional(),
  
  tests: z.array(z.object({
    testType: z.string(),
    results: z.string().optional(),
    datePerformed: z.string().datetime()
  })).optional()
})

export async function GET(
  request: NextRequest, 
  { params }: { params: { appointmentId: string } }
) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.appointmentId },
      include: {
        patient: { 
          include: { user: true } 
        },
        doctor: { 
          include: { user: true } 
        },
        prescriptions: true,
        tests: true
      }
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Appointment fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch appointment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: { appointmentId: string } }
) {
  const { appointmentId } = await params;
  try {
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    })

    if (!existingAppointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    const rawData = await request.json()
    const validatedData = AppointmentUpdateSchema.parse(rawData)

    // Validate related entities
    if (validatedData.patientId) {
      const patient = await prisma.patient.findUnique({
        where: { id: validatedData.patientId }
      })
      if (!patient) {
        return NextResponse.json({ 
          error: 'Patient not found',
          field: 'patientId'
        }, { status: 404 })
      }
    }

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

    const updatedAppointment = await prisma.$transaction(async (prisma) => {
      // Update core appointment details
      const { appointmentId } = await params;
      const appointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          ...(validatedData.patientId && { patientId: validatedData.patientId }),
          ...(validatedData.doctorId && { doctorId: validatedData.doctorId }),
          ...(validatedData.dateTime && { dateTime: new Date(validatedData.dateTime) }),
          ...(validatedData.status && { status: validatedData.status }),
          ...(validatedData.condition && { condition: validatedData.condition }),
          ...(validatedData.description && { description: validatedData.description }),
          ...(validatedData.specialization && { specialization: validatedData.specialization })
        }
      })

      // Add prescriptions if provided
      if (validatedData.prescriptions && validatedData.prescriptions.length > 0) {
        await prisma.prescription.createMany({
          data: validatedData.prescriptions.map(prescription => ({
            appointmentId: params.appointmentId,
            medication: prescription.medication,
            dosage: prescription.dosage,
            instructions: prescription.instructions
          }))
        })
      }

      // Add tests if provided
      if (validatedData.tests && validatedData.tests.length > 0) {
        await prisma.medicalTest.createMany({
          data: validatedData.tests.map(test => ({
            appointmentId: params.appointmentId,
            testType: test.testType,
            results: test.results,
            datePerformed: new Date(test.datePerformed)
          }))
        })
      }

      return appointment
    })

    // Fetch the updated appointment with all relations
    const fullUpdatedAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        prescriptions: true,
        tests: true
      }
    })

    return NextResponse.json(fullUpdatedAppointment)
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

    console.error('Appointment update error:', error)
    return NextResponse.json({ 
      error: 'Failed to update appointment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: { appointmentId: string } }
) {
  try {
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: params.appointmentId }
    })

    if (!existingAppointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.prescription.deleteMany({
        where: { appointmentId: params.appointmentId }
      })
      await tx.medicalTest.deleteMany({
        where: { appointmentId: params.appointmentId }
      })
      await tx.appointment.delete({
        where: { id: params.appointmentId }
      })
    })

    return NextResponse.json({ 
      message: 'Appointment and associated records deleted successfully' 
    }, { status: 200 })
  } catch (error) {
    console.error('Appointment deletion error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete appointment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}