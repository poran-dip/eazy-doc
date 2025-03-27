'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin } from "lucide-react"

// Update interface to match Prisma schema
interface Doctor {
  id: string
  name: string | null
  specialization: string
  status: 'AVAILABLE' | 'ON_DUTY' | 'OFF_DUTY' | 'UNAVAILABLE'
  rating: number
  image: string | null
  location: string | null
  appointments: any[] // You can create a more specific type if needed
}

export function DoctorsGrid() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/doctors')
      if (!response.ok) {
        throw new Error('Failed to fetch doctors')
      }
      const data = await response.json()
      
      // Safe transformation with schema-aligned defaults
      const safeDoctors = data.map((doctor: Doctor) => ({
        id: doctor.id ?? '',
        name: doctor.name ?? 'Unnamed Doctor',
        specialization: doctor.specialization ?? 'General Practice',
        status: doctor.status ?? 'AVAILABLE',
        rating: Number(doctor.rating ?? 0),
        image: doctor.image ?? "/placeholder.svg?height=400&width=400",
        location: doctor.location ?? 'Location Not Specified',
        appointments: doctor.appointments ?? []
      }))

      setDoctors(safeDoctors)
      setIsLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>Error: {error}</p>
        <Button onClick={fetchDoctors}>Try Again</Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin" size={48} />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {doctors.map((doctor) => (
        <Card key={doctor.id} className="overflow-hidden border shadow-sm">
          <div className="aspect-square relative">
            <Image 
              src={doctor.image || "/placeholder.svg"} 
              alt={doctor.name || "Doctor"} 
              fill 
              className="object-cover" 
            />
          </div>
          <CardHeader className="p-4">
            <CardTitle className="text-xl">{doctor.name}</CardTitle>
            <CardDescription>{doctor.specialization}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`w-4 h-4 ${i < Math.floor(Number(doctor.rating)) ? "opacity-100" : "opacity-30"}`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
              </div>
              <span className="ml-2 text-sm font-medium">
                {Number(doctor.rating).toFixed(1)}
              </span>
            </div>

            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
              {doctor.location}
            </div>

            <Badge 
              variant="outline" 
              className={`
                ${doctor.status === 'AVAILABLE' ? 'bg-green-50 text-green-700 border-green-200' : 
                  doctor.status === 'ON_DUTY' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                  doctor.status === 'OFF_DUTY' ? 'bg-gray-50 text-gray-700 border-gray-200' : 
                  'bg-red-50 text-red-700 border-red-200'}
              `}
            >
              {doctor.status}
            </Badge>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button 
              className="w-full bg-black text-white hover:bg-gray-800" 
              asChild
              disabled={doctor.status !== 'AVAILABLE'}
            >
              <Link href={`/appointment/${doctor.id}`}>
                {doctor.status === 'AVAILABLE' ? 'Book Appointment' : 'Not Available'}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default function DoctorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Healthcare Professionals</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse through our extensive network of skilled and compassionate doctors across various specialties.
        </p>
      </div>
      
      <DoctorsGrid />
    </div>
  )
}