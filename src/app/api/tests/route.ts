// app/api/tests/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Validation Schema for Test Creation
const TestCreateSchema = z.object({
  appointmentId: z.string().min(1, 'Appointment ID is required'),
  testType: z.string().min(1, 'Test type is required'),
  results: z.string().optional(),
  datePerformed: z.string().datetime()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Filtering options
    const appointmentId = searchParams.get('appointmentId') || undefined
    const testType = searchParams.get('testType') || undefined
    const startDate = searchParams.get('startDate') 
      ? new Date(searchParams.get('startDate')!) 
      : undefined
    const endDate = searchParams.get('endDate') 
      ? new Date(searchParams.get('endDate')!) 
      : undefined

    const tests = await prisma.medicalTest.findMany({
      where: {
        ...(appointmentId && { appointmentId }),
        ...(testType && { testType }),
        ...(startDate && { datePerformed: { gte: startDate } }),
        ...(endDate && { datePerformed: { lte: endDate } })
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
      orderBy: { datePerformed: 'desc' }
    })

    const total = await prisma.medicalTest.count({
      where: {
        ...(appointmentId && { appointmentId }),
        ...(testType && { testType }),
        ...(startDate && { datePerformed: { gte: startDate } }),
        ...(endDate && { datePerformed: { lte: endDate } })
      }
    })

    return NextResponse.json({
      tests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Tests fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch tests',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json()
    const validatedData = TestCreateSchema.parse(rawData)

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

    const test = await prisma.medicalTest.create({
      data: {
        ...validatedData,
        datePerformed: new Date(validatedData.datePerformed)
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

    return NextResponse.json(test, { status: 201 })
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

    console.error('Test creation error:', error)
    return NextResponse.json({ 
      error: 'Failed to create test',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}