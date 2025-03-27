// app/api/doctors/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Doctor Update Schema
const DoctorUpdateSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  specialization: z.string().optional(),
  status: z.enum(['AVAILABLE', 'ON_DUTY', 'OFF_DUTY', 'UNAVAILABLE']).optional(),
  rating: z.number().optional()
})

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
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
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
      data: body
    })

    return NextResponse.json(doctor)
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.appointment.updateMany({
      where: { doctorId: id },
      data: { doctorId: null }
    })

    await prisma.doctor.delete({
      where: { id }
    })

    return NextResponse.json({ 
      message: 'Doctor deleted successfully. Associated appointments updated.' 
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}