// app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/appointments - Get all appointments
export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            age: true,
            gender: true,
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            specialization: true,
          }
        }
      },
      orderBy: {
        dateTime: 'desc',
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Create a new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: body.patientId,
        doctorId: body.doctorId || null,
        dateTime: body.dateTime ? new Date(body.dateTime) : null,
        condition: body.condition || null,
        specialization: body.specialization || null,
        status: body.status || 'NEW',
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            age: true,
            gender: true,
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            specialization: true,
          }
        }
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}