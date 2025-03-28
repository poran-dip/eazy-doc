// app/api/auth/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const patientId = cookieStore.get('patientId')
  const doctorId = cookieStore.get('doctorId')
  const adminId = cookieStore.get('adminId')

  if (patientId) {
    return NextResponse.json({ 
      isLoggedIn: true, 
      role: 'patient' 
    })
  } else if (doctorId) {
    return NextResponse.json({ 
      isLoggedIn: true, 
      role: 'doctor' 
    })
  } else if (adminId) {
    return NextResponse.json({ 
      isLoggedIn: true, 
      role: 'admin' 
    })
  }

  return NextResponse.json({ 
    isLoggedIn: false, 
    role: null 
  })
}