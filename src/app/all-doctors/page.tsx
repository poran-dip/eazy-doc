'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from "next/image"
import Link from "next/link"
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

import Navbar from '@/components/navbar'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, Star, Search } from "lucide-react"

interface Doctor {
  id: string
  name: string | null
  specialization: string
  status: 'AVAILABLE' | 'ON_DUTY' | 'OFF_DUTY' | 'UNAVAILABLE'
  rating: number
  image: string | null
  location: string | null
  appointments: any[]
}

export function DoctorsList() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')

  const router = useRouter();

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

  const specializations = useMemo(() => {
    return [...new Set(doctors.map(doctor => doctor.specialization))]
  }, [doctors])

  const filteredDoctors = useMemo(() => {
    const specialization = selectedSpecialization === 'none' ? '' : selectedSpecialization;
    return doctors.filter(doctor => 
      (searchTerm === '' || 
        doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.location?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (specialization === '' || doctor.specialization === selectedSpecialization)
    )
  }, [doctors, searchTerm, selectedSpecialization])

  const handleBookAppointment = (doctorId: string) => {
    Cookies.set('selectedDoctorId', doctorId, { expires: 2/1440 })
    router.push(`/book`)
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
    <div className="pt-6 max-w-full sm:max-w-2/3 mx-auto">
      <p className="text-muted-foreground text-sm">
        Find the right doctor for your needs—search by name, location, or specialization.
      </p>

      {/* Filtering Section */}
      <div className="relative flex space-x-4 mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <Input 
          placeholder="Search for doctors" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 flex-grow"
        />
        <Select 
          value={selectedSpecialization} 
          onValueChange={setSelectedSpecialization}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All Specializations</SelectItem>
            {specializations.map(spec => (
              <SelectItem key={spec} value={spec}>{spec}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Doctors List */}
      <div className="space-y-4">
        {filteredDoctors.map((doctor) => (
          <div 
            key={doctor.id} 
            className="flex items-center justify-between border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Details */}
            <div className="flex items-center gap-x-6">
              {/* Doctor Image */}
              <div className="flex-shrink-0 w-24 h-24 relative">
                <div className="w-24 h-24 relative">
                  <Image 
                    src={doctor.image || "/placeholder.svg"} 
                    alt={doctor.name || "Doctor"} 
                    fill 
                    className="object-cover rounded-full" 
                  />
                </div>
              </div>

              {/* Doctor Info */}
              <div className="col-span-4">
                <h3 className="text-xl font-semibold">{doctor.name}</h3>
                <div className="text-muted-foreground">
                  <p>{doctor.specialization}</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    {doctor.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Booking options */}
            <div className="flex items-center gap-x-6">
              {/* Rating and Status - 2 columns */}
              <div className="flex flex-col items-center mr-4">
                <div className="flex items-center mb-1">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="font-medium">{Number(doctor.rating).toFixed(1)}</span>
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
              </div>

              {/* Action Buttons */}
              <div className="col-span-2 flex justify-end">
                <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                  <Button 
                    variant="outline" 
                    className="w-full min-w-[160px]"
                    asChild
                  >
                    <Link href={`/profile/${doctor.id}`}>
                      View Profile
                    </Link>
                  </Button>
                  <Button
                    onClick={() => doctor.status === 'AVAILABLE' && handleBookAppointment(doctor.id)}
                    className="w-full cursor-pointer bg-black text-white hover:bg-gray-800"
                    disabled={doctor.status !== 'AVAILABLE'}
                  >
                    {doctor.status === 'AVAILABLE' ? "Book Appointment" : "Not Available"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DoctorsPage() {
  return (
    <div>
      <Navbar />
      <DoctorsList />
    </div>
  )
}