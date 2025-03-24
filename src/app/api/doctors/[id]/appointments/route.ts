// File: app/api/doctors/[doctorId]/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Create a single PrismaClient instance and reuse it
const prisma = new PrismaClient();

// GET handler for doctor appointments
export async function GET(
  request: NextRequest,
  { params }: { params: { doctorId: string } }
) {
  try {
    // Extract doctorId from params and log for debugging
    const { doctorId } = params;
    console.log("Doctor ID from params:", doctorId);
    
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');
    const includePatientDetails = searchParams.get('includePatientDetails') === 'true';

    // Also check URL for debugging
    const url = request.url;
    console.log("Request URL:", url);
    
    // This is critical - the doctorId should come from params, but if it's not working
    // we'll try to extract it from the URL as a fallback
    let effectiveDoctorId = doctorId;
    
    if (!effectiveDoctorId) {
      // Try to extract from URL as fallback
      const urlParts = url.split('/');
      const potentialDoctorId = urlParts[urlParts.indexOf('doctors') + 1];
      console.log("Extracted from URL:", potentialDoctorId);
      effectiveDoctorId = potentialDoctorId;
    }
    
    // Final validation
    if (!effectiveDoctorId) {
      return NextResponse.json(
        { message: 'Doctor ID is required', params: params },
        { status: 400 }
      );
    }

    const where: any = {
      doctorId: effectiveDoctorId
    };

    // Add date filtering if provided
    if (startDate && endDate) {
      where.dateTime = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    // Add status filtering if provided
    if (status && status !== 'all') {
      where.status = status;
    }

    // Define what patient fields to include based on the request
    const patientSelect = includePatientDetails 
      ? {
          id: true,
          name: true,
          email: true,
          age: true,
          gender: true,
        }
      : {
          id: true,
          name: true,
        };

    // Fetch doctor's appointments with patient information
    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: patientSelect,
        },
      },
      orderBy: {
        dateTime: searchParams.get('order') === 'desc' ? 'desc' : 'asc',
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    // Enhanced error logging
    console.error('Error in appointments API:', error);
    
    return NextResponse.json(
      { 
        message: 'Failed to fetch appointments',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}