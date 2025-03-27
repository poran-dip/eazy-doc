// app/api/ambulances/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Ambulance Update Schema
const AmbulanceUpdateSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(['AVAILABLE', 'ON_DUTY', 'OFF_DUTY', 'UNAVAILABLE']).optional(),
  rating: z.number().optional()
})

export async function GET(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const ambulance = await prisma.ambulance.findUnique({
      where: { id },
      include: {
        appointments: {
          include: {
            patient: true,
            doctor: true
          },
          orderBy: {
            dateTime: 'desc'
          }
        }
      }
    })

    if (!ambulance) {
      return NextResponse.json({ 
        error: 'Ambulance not found' 
      }, { status: 404 })
    }

    return NextResponse.json(ambulance)
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

    const validation = AmbulanceUpdateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error.errors 
      }, { status: 400 })
    }

    const ambulance = await prisma.ambulance.update({
      where: { id },
      data: body
    })

    return NextResponse.json(ambulance)
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
      where: { ambulanceId: id },
      data: { ambulanceId: null }
    })

    await prisma.ambulance.delete({
      where: { id }
    })

    return NextResponse.json({ 
      message: 'Ambulance deleted successfully. Associated appointments updated.' 
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}