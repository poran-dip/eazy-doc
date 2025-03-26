// app/api/prescriptions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Validation Schema for Prescription Creation
const PrescriptionCreateSchema = z.object({
  appointmentId: z.string().min(1, 'Appointment ID is required'),
  medication: z.string().min(1, 'Medication is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  instructions: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Filtering options
    const appointmentId = searchParams.get('appointmentId') || undefined
    const medication = searchParams.get('medication') || undefined

    const prescriptions = await prisma.prescription.findMany({
      where: {
        ...(appointmentId && { appointmentId }),
        ...(medication && { medication: { contains: medication, mode: 'insensitive' } })
      },
      include: {
        appointment: {
          include: {
            patient: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { medication: 'asc' }
    })

    const total = await prisma.prescription.count({
      where: {
        ...(appointmentId && { appointmentId }),
        ...(medication && { medication: { contains: medication, mode: 'insensitive' } })
      }
    })

    return NextResponse.json({
      prescriptions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Prescriptions fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch prescriptions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json()
    const validatedData = PrescriptionCreateSchema.parse(rawData)

    // Validate that appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { id: validatedData.appointmentId }
    })

    if (!appointment) {
      return NextResponse.json({ 
        error: 'Appointment not found',
        field: 'appointmentId'
      }, { status: 404 })
    }

    const prescription = await prisma.prescription.create({
      data: validatedData,
      include: {
        appointment: {
          include: {
            patient: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json(prescription, { status: 201 })
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

    console.error('Prescription creation error:', error)
    return NextResponse.json({ 
      error: 'Failed to create prescription',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}