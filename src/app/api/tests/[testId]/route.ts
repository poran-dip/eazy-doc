// app/api/tests/[testId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Validation Schema for Test Update
const TestUpdateSchema = z.object({
  appointmentId: z.string().optional(),
  testType: z.string().optional(),
  results: z.string().optional(),
  datePerformed: z.string().datetime().optional()
})

export async function GET(
  request: NextRequest, 
  { params }: { params: { testId: string } }
) {
  try {
    const test = await prisma.medicalTest.findUnique({
      where: { id: params.testId },
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

    if (!test) {
      return NextResponse.json({ error: 'Medical test not found' }, { status: 404 })
    }

    return NextResponse.json(test)
  } catch (error) {
    console.error('Medical test fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch medical test',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: { testId: string } }
) {
  try {
    // Validate test exists
    const existingTest = await prisma.medicalTest.findUnique({
      where: { id: params.testId }
    })

    if (!existingTest) {
      return NextResponse.json({ error: 'Medical test not found' }, { status: 404 })
    }

    // Parse and validate input
    const rawData = await request.json()
    const validatedData = TestUpdateSchema.parse(rawData)

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
    const updatedTest = await prisma.medicalTest.update({
      where: { id: params.testId },
      data: {
        ...validatedData,
        datePerformed: validatedData.datePerformed 
          ? new Date(validatedData.datePerformed) 
          : undefined
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
      }
    })

    return NextResponse.json(updatedTest)
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

    console.error('Medical test update error:', error)
    return NextResponse.json({ 
      error: 'Failed to update medical test',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: { testId: string } }
) {
  try {
    // Check if test exists
    const existingTest = await prisma.medicalTest.findUnique({
      where: { id: params.testId }
    })

    if (!existingTest) {
      return NextResponse.json({ error: 'Medical test not found' }, { status: 404 })
    }

    // Delete the test
    await prisma.medicalTest.delete({
      where: { id: params.testId }
    })

    return NextResponse.json({ 
      message: 'Medical test deleted successfully',
      deletedId: params.testId 
    })
  } catch (error) {
    console.error('Medical test deletion error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete medical test',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}