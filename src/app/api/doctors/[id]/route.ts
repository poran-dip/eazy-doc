// app/api/doctors/[id]/route.ts (GET, PATCH, DELETE doctor by ID)
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// GET specific doctor
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id },
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
    
    if (!doctor) {
      return NextResponse.json(
        { message: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    // Remove password from response
    const { password, ...doctorWithoutPassword } = doctor;
    return NextResponse.json(doctorWithoutPassword);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json(
      { message: 'Failed to fetch doctor' },
      { status: 500 }
    );
  }
}

// PATCH (update) doctor
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    const body = await request.json();
    const { name, email, password, specialization } = body;
    
    // Check if doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id }
    });
    
    if (!existingDoctor) {
      return NextResponse.json(
        { message: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    // Check if trying to update to an email that belongs to another doctor
    if (email && email !== existingDoctor.email) {
      const emailExists = await prisma.doctor.findUnique({
        where: { email }
      });
      
      if (emailExists) {
        return NextResponse.json(
          { message: 'Email already in use by another doctor' },
          { status: 409 }
        );
      }
    }
    
    // Prepare update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (specialization) updateData.specialization = specialization;
    
    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    // Update doctor
    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: updateData
    });
    
    // Remove password from response
    const { password: _, ...doctorWithoutPassword } = updatedDoctor;
    return NextResponse.json(doctorWithoutPassword);
  } catch (error) {
    console.error('Error updating doctor:', error);
    return NextResponse.json(
      { message: 'Failed to update doctor' },
      { status: 500 }
    );
  }
}

// DELETE doctor
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    // Check if doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        appointments: true
      }
    });
    
    if (!existingDoctor) {
      return NextResponse.json(
        { message: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    // Delete doctor
    await prisma.doctor.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    
    // Safely check for Prisma constraint errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2003 is the error code for foreign key constraint failure
      if (error.code === 'P2003') {
        return NextResponse.json(
          { message: 'Cannot delete doctor with existing appointments. Please reassign or cancel appointments first.' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { message: 'Failed to delete doctor' },
      { status: 500 }
    );
  }
}