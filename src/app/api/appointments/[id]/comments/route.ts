// File: app/api/appointments/[appointmentId]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { comments, status } = await request.json();
    
    console.log("Received params:", params);
    console.log("Appointment ID:", id);
    console.log("Request body:", { comments, status });

    // Validate input
    if (!id) {
      return NextResponse.json(
        { message: 'Appointment ID is required' },
        { status: 400 }
      );
    }
    
    // Update the appointment with new comments and status
    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: id
      },
      data: {
        comments: comments,
        status: status || undefined, // Only update status if provided
      }
    });
    
    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment comments:', error);
    
    return NextResponse.json(
      { 
        message: 'Failed to update appointment comments',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}