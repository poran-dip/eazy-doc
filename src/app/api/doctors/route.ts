// app/api/doctors/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

// Doctor Validation Schema
const DoctorSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  image: z.string().optional(),
  location: z.string().optional(),
  specialization: z.string(),
  status: z.enum(['AVAILABLE', 'ON_DUTY', 'OFF_DUTY', 'UNAVAILABLE']).optional().default('AVAILABLE')
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validation = DoctorSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error.errors 
      }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const doctor = await prisma.doctor.create({
      data: {
        ...validation.data,
        password: hashedPassword
      }
    })

    // Exclude sensitive information
    const { password, ...doctorResponse } = doctor

    return NextResponse.json(doctorResponse, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const specialization = searchParams.get('specialization')
    const location = searchParams.get('location')

    const doctors = await prisma.doctor.findMany({
      where: {
        ...(specialization ? { specialization } : {}),
        ...(location ? { location } : {})
      },
      select: {
        id: true,
        email: true,
        name: true,
        specialization: true,
        status: true,
        rating: true,
        image: true,
        location: true,
        appointments: {
          select: {
            id: true,
            status: true
          }
        }
      }
    })
    return NextResponse.json(doctors)
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}