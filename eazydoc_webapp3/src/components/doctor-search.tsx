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

export default function DoctorSearch() {
  const [specialty, setSpecialty] = useState("")
  const [location, setLocation] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock search results
      const results = [
        {
          id: 101,
          name: "Dr. Robert Smith",
          specialty: "Cardiology",
          rating: 4.7,
          reviews: 83,
          location: "New York, NY",
          distance: "2.3 miles away",
          availability: "Available Today",
          image: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 102,
          name: "Dr. Lisa Wong",
          specialty: "Dermatology",
          rating: 4.9,
          reviews: 127,
          location: "New York, NY",
          distance: "3.1 miles away",
          availability: "Available Tomorrow",
          image: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 103,
          name: "Dr. David Miller",
          specialty: "General Practice",
          rating: 4.8,
          reviews: 95,
          location: "New York, NY",
          distance: "1.5 miles away",
          availability: "Available Today",
          image: "/placeholder.svg?height=100&width=100",
        },
      ]

      setSearchResults(results)
      setIsSearching(false)
    }, 1500)
  }

  return (
    <div className="space-y-auto w-full h-auto max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardContent className="p-6"> 
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="specialty" className="text-sm font-medium">
                  Specialty
                </label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="dermatology">Dermatology</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="psychiatry">Psychiatry</SelectItem>
                    <SelectItem value="general">General Practice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="location"
                    placeholder="City, State or Zip Code"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" className="flex-shrink-0" disabled={isSearching}>
                    <Search className="h-4 w-4 mr-2" />
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Search Results</h3>
          <div className="space-y-4">
            {searchResults.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={doctor.image} alt={doctor.name} />
                      <AvatarFallback>
                        {doctor.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
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
                        <span className="ml-2 text-sm">
                          {doctor.rating} ({doctor.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {doctor.location}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {doctor.distance}
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                          {doctor.availability}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center sm:flex-col sm:items-end gap-2 mt-4 sm:mt-0">
                      <Button asChild>
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

