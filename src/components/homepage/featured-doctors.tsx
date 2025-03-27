import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"

async function getFeaturedDoctors() {
  try {
    const doctors = await prisma.doctor.findMany({
      take: 4,
      include: {
        user: true,
        ratings: true
      },
      orderBy: {
        ratings: {
          _count: 'desc' // Optional: order by most rated doctors
        }
      }
    })

    return doctors.map(doctor => ({
      id: doctor.id,
      name: doctor.user.name || 'Unnamed Doctor',
      specialty: doctor.specialization,
      rating: doctor.ratings.length > 0 
        ? doctor.ratings.reduce((sum, rating) => sum + rating.stars, 0) / doctor.ratings.length 
        : 0,
      reviews: doctor.ratings.length,
      location: 'Location Not Available', // You might want to add location to your schema
      availability: 'Availability Not Implemented', // Implement logic for checking availability
      image: doctor.user.image || "/placeholder.svg?height=400&width=400"
    }))
  } catch (error) {
    console.error('Error fetching featured doctors:', error)
    return []
  }
}

export default async function FeaturedDoctors() {
  const doctors = await getFeaturedDoctors()

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter">Featured Doctors</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
            Our top-rated healthcare professionals ready to provide the care you need.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden border shadow-sm">
              <div className="aspect-square relative">
                <Image src={doctor.image || "/placeholder.svg"} alt={doctor.name} fill className="object-cover" />
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
                    {doctor.rating.toFixed(1)} ({doctor.reviews} reviews)
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
        <div className="flex justify-center mt-10">
          <Button variant="outline">
            <Link href="/all-doctors">View All Doctors</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}