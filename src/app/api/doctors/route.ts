// app/api/doctors/route.ts (GET all doctors, POST new doctor)
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// GET all doctors
export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        appointments: {
          include: {
            patient: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    });
    
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { message: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

// POST new doctor
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, specialization } = body;
    
    // Validate required fields
    if (!name || !email || !password || !specialization) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if doctor with email already exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { email }
    });
    
    if (existingDoctor) {
      return NextResponse.json(
        { message: 'Doctor with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new doctor
    const newDoctor = await prisma.doctor.create({
      data: {
        name,
        email,
        password: hashedPassword,
        specialization,
      }
    });
    
    // Exclude password from response
    const { password: _, ...doctorWithoutPassword } = newDoctor;
    
    return NextResponse.json(doctorWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error creating doctor:', error);
    return NextResponse.json(
      { message: 'Failed to create doctor' },
      { status: 500 }
    );
  }
}