import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET - Fetch all appointments for a patient
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const appointments = await prisma.appointment.findMany({
      where: { patientId: id },
      select: {
        id: true,
        dateTime: true,
        condition: true,
        specialization: true,
        status: true,
        doctor: {
          select: {
            name: true,
            email: true,
            specialization: true,
          }
        }
      }
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
