// app/api/prescriptions/[prescriptionId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Validation Schema for Prescription Update
const PrescriptionUpdateSchema = z.object({
  appointmentId: z.string().optional(),
  medication: z.string().optional(),
  dosage: z.string().optional(),
  instructions: z.string().optional()
})

export async function GET(
  request: NextRequest, 
  { params }: { params: { prescriptionId: string } }
) {
  try {
    const prescription = await prisma.prescription.findUnique({
      where: { id: params.prescriptionId },
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
            },
            doctor: true
          }
        }
      }
    })

    if (!prescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 })
    }

    return NextResponse.json(prescription)
  } catch (error) {
    console.error('Prescription fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch prescription',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: { prescriptionId: string } }
) {
  try {
    // Validate prescription exists
    const existingPrescription = await prisma.prescription.findUnique({
      where: { id: params.prescriptionId }
    })

    if (!existingPrescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 })
    }

    // Parse and validate input
    const rawData = await request.json()
    const validatedData = PrescriptionUpdateSchema.parse(rawData)

    // Validate appointment if provided
    if (validatedData.appointmentId) {
      const appointment = await prisma.appointment.findUnique({
        where: { id: validatedData.appointmentId }
      })
      if (!appointment) {
        return NextResponse.json({ 
          error: 'Appointment not found',
          field: 'appointmentId'
        }, { status: 404 })
      }
    }

    // Perform update
    const updatedPrescription = await prisma.prescription.update({
      where: { id: params.prescriptionId },
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

    return NextResponse.json(updatedPrescription)
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

    console.error('Prescription update error:', error)
    return NextResponse.json({ 
      error: 'Failed to update prescription',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: { prescriptionId: string } }
) {
  try {
    // Check if prescription exists
    const existingPrescription = await prisma.prescription.findUnique({
      where: { id: params.prescriptionId }
    })

    if (!existingPrescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 })
    }

    // Delete the prescription
    await prisma.prescription.delete({
      where: { id: params.prescriptionId }
    })

    return NextResponse.json({ 
      message: 'Prescription deleted successfully',
      deletedId: params.prescriptionId 
    })
  } catch (error) {
    console.error('Prescription deletion error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete prescription',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}