"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Import Prisma client
import { prisma } from "@/lib/prisma"

// Type for Doctor Search Result
interface DoctorResult {
  id: string
  name: string | null
  specialty: string
  image: string | null
  averageRating: number
  reviewCount: number
}

export default function DoctorSearch() {
  const [specialty, setSpecialty] = useState("")
  const [location, setLocation] = useState("")
  const [searchResults, setSearchResults] = useState<DoctorResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    try {
      // Fetch doctors based on search criteria
      const doctors = await prisma.doctor.findMany({
        where: {
          // Filter by specialty if selected
          ...(specialty ? { specialization: specialty } : {}),
          verified: true // Only show verified doctors
        },
        include: {
          user: true, // Include user details to get name and image
          ratings: true // Include ratings to calculate average
        },
        take: 10 // Limit to 10 results
      })

      // Transform doctors into search results
      const results: DoctorResult[] = doctors.map(doctor => {
        // Calculate average rating
        const averageRating = doctor.ratings.length > 0 
          ? doctor.ratings.reduce((sum, rating) => sum + rating.stars, 0) / doctor.ratings.length 
          : 0

        return {
          id: doctor.id,
          name: doctor.user.name,
          specialty: doctor.specialization,
          image: doctor.user.image,
          averageRating,
          reviewCount: doctor.ratings.length
        }
      })

      setSearchResults(results)
    } catch (error) {
      console.error("Error searching for doctors:", error)
      // Optionally set an error state or show a toast
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-sm bg-white">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-0">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <label htmlFor="specialty" className="text-sm font-medium block mb-2">
                  Specialty
                </label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger id="specialty" className="w-full">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                    <SelectItem value="General Practice">General Practice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-5">
                <label htmlFor="location" className="text-sm font-medium block mb-2">
                  Location
                </label>
                <Input
                  id="location"
                  placeholder="City, State or Zip Code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full"
                  disabled // Temporarily disabled until location is added to schema
                />
              </div>
              <div className="md:col-span-2 flex items-end">
                <Button 
                  type="submit" 
                  className="w-full bg-black text-white hover:bg-gray-800" 
                  disabled={isSearching}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <div className="space-y-4 mt-8">
          <h3 className="text-xl font-semibold">Search Results</h3>
          <div className="space-y-4">
            {searchResults.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage 
                        src={doctor.image || "/placeholder.svg?height=100&width=100"} 
                        alt={doctor.name || "Doctor"} 
                      />
                      <AvatarFallback>
                        {doctor.name?.split(" ")
                          .map((n: string) => n[0])
                          .join("") || "DR"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div>
                        <h4 className="text-lg font-semibold">{doctor.name}</h4>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {Array(5)
                            .fill(null)
                            .map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className={`w-4 h-4 ${i < Math.floor(doctor.averageRating) ? "opacity-100" : "opacity-30"}`}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ))}
                        </div>
                        <span className="ml-2 text-sm">
                          {doctor.averageRating.toFixed(1)} ({doctor.reviewCount} reviews)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          Specialty: {doctor.specialty}
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                          Verified Doctor
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center sm:flex-col sm:items-end gap-2 mt-4 sm:mt-0">
                      <Button asChild className="bg-black text-white hover:bg-gray-800">
                        <Link href={`/appointment/${doctor.id}`}>Book Appointment</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/doctor/${doctor.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}