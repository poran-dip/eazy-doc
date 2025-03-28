// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies();
  
  // Clear all possible login cookies
  cookieStore.delete('patientId');
  cookieStore.delete('doctorId');
  cookieStore.delete('adminId');

  return NextResponse.json({ 
    message: 'Logged out successfully' 
  })
}