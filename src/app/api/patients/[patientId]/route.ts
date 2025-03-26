// app/api/patients/[patientId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Simplified Validation Schema
const PatientUpdateSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().optional(),
  name: z.string().optional(),
  age: z.number().int().optional(),
  gender: z.string().optional()
})

export async function GET(
  request: NextRequest, 
  context: { params: { patientId: string } }
) {
  try {
    const { params } = context
    const patient = await prisma.patient.findUnique({
      where: { id: params.patientId },
      include: {
        user: true,
        appointments: {
          include: {
            doctor: {
              include: { user: true }
            },
            prescriptions: true,
            tests: true
          },
          orderBy: { dateTime: 'desc' }
        }
      }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    return NextResponse.json(patient)
  } catch (error) {
    console.error('Patient fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch patient',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest, 
  context: { params: { patientId: string } }
) {
  try {
    const { params } = context
    const existingPatient = await prisma.patient.findUnique({
      where: { id: params.patientId },
      include: { user: true }
    })

    if (!existingPatient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    const rawData = await request.json()
    const validatedData = PatientUpdateSchema.parse(rawData)

    const { email, password, ...updatedFields } = validatedData

    if (email && email !== existingPatient.user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
      }
    }

    let hashedPassword: string | undefined
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    const updatedPatient = await prisma.$transaction(async (tx) => {
      if (email || hashedPassword || updatedFields.name) {
        await tx.user.update({
          where: { id: existingPatient.user.id },
          data: {
            ...(updatedFields.name && { name: updatedFields.name }),
            ...(email && { email: email }),
            ...(hashedPassword && { password: hashedPassword })
          }
        })
      }

      // Update patient details
      return tx.patient.update({
        where: { id: params.patientId },
        data: {
          ...(updatedFields.age !== undefined && { age: updatedFields.age }),
          ...(updatedFields.gender !== undefined && { gender: updatedFields.gender })
        },
        include: {
          user: true,
          appointments: true
        }
      })
    })

    return NextResponse.json(updatedPatient)
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

    console.error('Patient update error:', error)
    return NextResponse.json({ 
      error: 'Failed to update patient',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest, 
  context: { params: { patientId: string } }
) {
  try {
    const { params } = context
    
    const existingPatient = await prisma.patient.findUnique({
      where: { id: params.patientId },
      include: { user: true }
    })

    if (!existingPatient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.prescription.deleteMany({
        where: { appointment: { patientId: params.patientId } }
      })
      await tx.medicalTest.deleteMany({
        where: { appointment: { patientId: params.patientId } }
      })
      await tx.appointment.deleteMany({
        where: { patientId: params.patientId }
      })
      await tx.patient.delete({
        where: { id: params.patientId }
      })
      await tx.user.delete({
        where: { id: existingPatient.user.id }
      })
    })

    return NextResponse.json({ 
      message: 'Patient and associated records deleted successfully' 
    }, { status: 200 })
  } catch (error) {
    console.error('Patient deletion error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete patient',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}