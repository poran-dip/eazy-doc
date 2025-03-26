// app/api/doctors/[doctorId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Validation Schema for Update
const DoctorUpdateSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().optional(),
  name: z.string().optional(),
  specialization: z.string().optional(),
  license: z.string().optional(),
  verified: z.boolean().optional()
})

export async function GET(
  request: NextRequest, 
  context: { params: { doctorId: string } }
) {
  try {
    const { params } = context
    const doctor = await prisma.doctor.findUnique({
      where: { id: params.doctorId },
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

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    return NextResponse.json(doctor)
  } catch (error) {
    console.error('Doctor fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch doctor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest, 
  context: { params: { doctorId: string } }
) {
  try {
    const { params } = context
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: params.doctorId },
      include: { user: true }
    })

    if (!existingDoctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    const rawData = await request.json()
    const validatedData = DoctorUpdateSchema.parse(rawData)

    const { email, password, ...updatedFields } = validatedData

    if (email && email !== existingDoctor.user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
      }
    }

    let hashedPassword: string | undefined
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    const updatedDoctor = await prisma.$transaction(async (tx) => {
      if (email || hashedPassword || updatedFields.name) {
        await tx.user.update({
          where: { id: existingDoctor.user.id },
          data: { 
            ...(updatedFields.name && { name: updatedFields.name }),
            ...(email && { email: email }),
            ...(hashedPassword && { password: hashedPassword })
          }
        })
      }
      
      // Update doctor details
      return tx.doctor.update({
        where: { id: params.doctorId },
        data: {
          ...(updatedFields.specialization && { specialization: updatedFields.specialization }),
          ...(updatedFields.license && { license: updatedFields.license }),
          ...(updatedFields.verified !== undefined && { verified: updatedFields.verified })
        },
        include: {
          user: true,
          appointments: true,
          ratings: true
        }
      })
    })

    return NextResponse.json(updatedDoctor)
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

    console.error('Doctor update error:', error)
    return NextResponse.json({ 
      error: 'Failed to update doctor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest, 
  context: { params: { doctorId: string } }
) {
  try {
    const { params } = context

    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: params.doctorId },
      include: { user: true }
    })

    if (!existingDoctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.rating.deleteMany({
        where: { doctorId: params.doctorId }
      })
      await tx.prescription.deleteMany({
        where: { 
          appointment: { 
            doctorId: params.doctorId 
          } 
        }
      })
      await tx.medicalTest.deleteMany({
        where: { 
          appointment: { 
            doctorId: params.doctorId 
          } 
        }
      })
      await tx.appointment.deleteMany({
        where: { doctorId: params.doctorId }
      })
      await tx.doctor.delete({
        where: { id: params.doctorId }
      })
      await tx.user.delete({
        where: { id: existingDoctor.user.id }
      })
    })

    return NextResponse.json({ 
      message: 'Doctor and associated records deleted successfully' 
    }, { status: 200 })
  } catch (error) {
    console.error('Doctor deletion error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete doctor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}