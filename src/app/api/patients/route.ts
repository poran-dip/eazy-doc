// app/api/patients/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

// Patient Validation Schema
const PatientSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  image: z.string().optional(),
  age: z.number().optional(),
  gender: z.string().optional()
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validation = PatientSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error.errors 
      }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const patient = await prisma.patient.create({
      data: {
        ...body,
        password: hashedPassword
      }
    })

    return NextResponse.json(patient, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        gender: true,
        appointments: true
      }
    })
    return NextResponse.json(patients)
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}