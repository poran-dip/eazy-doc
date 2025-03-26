// app/api/ambulances/[ambulanceId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Validation Schema for Update
const AmbulanceUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  status: z.enum(['AVAILABLE', 'ON_DUTY', 'UNAVAILABLE']).optional()
})

export async function GET(
  request: NextRequest, 
  { params }: { params: { ambulanceId: string } }
) {
  try {
    const ambulance = await prisma.ambulance.findUnique({
      where: { id: params.ambulanceId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        },
        appointments: {
          include: {
            patient: {
              include: {
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          },
          orderBy: { dateTime: 'desc' }
        },
        ratings: true
      }
    })

    if (!ambulance) {
      return NextResponse.json({ error: 'Ambulance not found' }, { status: 404 })
    }

    return NextResponse.json(ambulance)
  } catch (error) {
    console.error('Ambulance fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch ambulance',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: { ambulanceId: string } }
) {
  try {
    // Validate ambulance exists
    const existingAmbulance = await prisma.ambulance.findUnique({
      where: { id: params.ambulanceId }
    })

    if (!existingAmbulance) {
      return NextResponse.json({ error: 'Ambulance not found' }, { status: 404 })
    }

    // Parse and validate input
    const rawData = await request.json()
    const validatedData = AmbulanceUpdateSchema.parse(rawData)

    // Prepare update data
    const updateData: any = {}
    
    // Update user details if name is provided
    if (validatedData.name) {
      await prisma.user.update({
        where: { id: existingAmbulance.userId },
        data: { name: validatedData.name }
      })
    }

    // Update ambulance-specific fields
    if (validatedData.latitude !== undefined) {
      updateData.latitude = validatedData.latitude
    }
    if (validatedData.longitude !== undefined) {
      updateData.longitude = validatedData.longitude
    }
    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status
    }

    // Perform update
    const updatedAmbulance = await prisma.ambulance.update({
      where: { id: params.ambulanceId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(updatedAmbulance)
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

    console.error('Ambulance update error:', error)
    return NextResponse.json({ 
      error: 'Failed to update ambulance',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: { ambulanceId: string } }
) {
  try {
    // Check if ambulance exists
    const existingAmbulance = await prisma.ambulance.findUnique({
      where: { id: params.ambulanceId }
    })

    if (!existingAmbulance) {
      return NextResponse.json({ error: 'Ambulance not found' }, { status: 404 })
    }

    // Check for existing future appointments
    const futureAppointments = await prisma.appointment.count({
      where: { 
        ambulanceId: params.ambulanceId,
        status: { not: 'CANCELED' },
        dateTime: { gte: new Date() }
      }
    })

    if (futureAppointments > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete ambulance with future appointments',
        details: `${futureAppointments} future appointments exist`
      }, { status: 400 })
    }

    // Delete ambulance in a transaction to remove user and related records
    await prisma.$transaction([
      // Cancel all appointments
      prisma.appointment.updateMany({
        where: { ambulanceId: params.ambulanceId },
        data: { ambulanceId: null, status: 'CANCELED' }
      }),
      // Delete ratings
      prisma.rating.deleteMany({
        where: { ambulanceId: params.ambulanceId }
      }),
      // Delete ambulance
      prisma.ambulance.delete({
        where: { id: params.ambulanceId }
      }),
      // Delete user
      prisma.user.delete({
        where: { id: existingAmbulance.userId }
      })
    ])

    return NextResponse.json({ 
      message: 'Ambulance deleted successfully',
      deletedId: params.ambulanceId 
    })
  } catch (error) {
    console.error('Ambulance deletion error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete ambulance',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}