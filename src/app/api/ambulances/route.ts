// app/api/ambulances/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Validation Schema
const AmbulanceCreateSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      'Password must include uppercase, lowercase, number, and special character'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  status: z.enum(['AVAILABLE', 'ON_DUTY', 'UNAVAILABLE']).optional()
})

export enum AmbulanceStatus {
  AVAILABLE = 'AVAILABLE',
  ON_DUTY = 'ON_DUTY',
  UNAVAILABLE = 'UNAVAILABLE',
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') as AmbulanceStatus | undefined

    const ambulances = await prisma.ambulance.findMany({
      where: {
        AND: [
          {
            OR: [
              { user: { name: { contains: search, mode: 'insensitive' } } }
            ]
          },
          ...(status ? [{ status: { equals: status } }] : [])
        ]
      },
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
          select: { 
            id: true, 
            status: true, 
            dateTime: true 
          }
        },
        ratings: true
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { user: { createdAt: 'desc' } }
    })

    const total = await prisma.ambulance.count({
      where: {
        AND: [
          {
            OR: [
              { user: { name: { contains: search, mode: 'insensitive' } } }
            ]
          },
          ...(status ? [{ status }] : [])
        ]
      }
    })

    return NextResponse.json({
      ambulances,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Ambulances fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch ambulances',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json()
    const validatedData = AmbulanceCreateSchema.parse(rawData)

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json({ 
        error: 'Email already exists',
        field: 'email'
      }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    const ambulance = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name,
          role: 'AMBULANCE'
        }
      })

      return tx.ambulance.create({
        data: {
          userId: user.id,
          latitude: validatedData.latitude,
          longitude: validatedData.longitude,
          status: validatedData.status || 'AVAILABLE'
        },
        include: { 
          user: {
            select: { 
              id: true, 
              email: true, 
              name: true 
            } 
          }
        }
      })
    })

    return NextResponse.json(ambulance, { status: 201 })
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

    console.error('Ambulance creation error:', error)
    return NextResponse.json({ 
      error: 'Failed to create ambulance',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}