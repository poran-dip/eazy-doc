import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest, 
  { params }: { params: { userId: string } }
) {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { 
        userId: params.userId 
      },
      include: {
        user: true  // Optionally include user details
      }
    })

    if (!doctor) {
      return NextResponse.json({ 
        error: 'Doctor not found for the given user ID' 
      }, { status: 404 })
    }

    return NextResponse.json(doctor)
  } catch (error) {
    console.error('Doctor fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch doctor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}