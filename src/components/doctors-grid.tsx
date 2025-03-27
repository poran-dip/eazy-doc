'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface Doctor {
  id: string
  name: string
  specialty: string
  rating: number
  reviews: number
  location: string
  availability: string
  image: string
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
      
      // Ensure safe transformation with default values
      const safeDoctors = data.map((doctor: any) => ({
        id: doctor.id ?? '',
        name: doctor.name ?? 'Unnamed Doctor',
        specialty: doctor.specialty ?? 'General Practice',
        rating: Number(doctor.rating || 0),
        reviews: Number(doctor.reviews || 0),
        location: doctor.location ?? 'Location Not Available',
        availability: doctor.availability ?? 'Not Specified',
        image: doctor.image ?? "/placeholder.svg?height=400&width=400"
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
              alt={doctor.name} 
              fill 
              className="object-cover" 
            />
          </div>
          <CardHeader className="p-4">
            <CardTitle className="text-xl">{doctor.name}</CardTitle>
            <CardDescription>{doctor.specialty}</CardDescription>
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
                      className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? "opacity-100" : "opacity-30"}`}
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
                {(doctor.rating || 0).toFixed(1)} ({doctor.reviews} reviews)
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{doctor.location}</p>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {doctor.availability}
            </Badge>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full bg-black text-white hover:bg-gray-800" asChild>
              <Link href={`/appointment/${doctor.id}`}>Book Appointment</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}