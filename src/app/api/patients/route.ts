// File: /app/api/patients/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// GET - Fetch all patients
export async function GET(req: NextRequest) {
  try {
    const patients = await prisma.patient.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        gender: true,
        // Exclude password for security
      }
    });
    
    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

// POST - Create a new patient
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Basic validation 
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingPatient = await prisma.patient.findUnique({
      where: { email: body.email }
    });
    
    if (existingPatient) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10);
    
    // Create the patient
    const newPatient = await prisma.patient.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        age: body.age || null,
        gender: body.gender || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        gender: true,
        // Exclude password
      }
    });
    
    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    );
  }
}