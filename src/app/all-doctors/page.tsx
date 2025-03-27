// app/doctors/page.tsx
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DoctorsGrid } from "@/components/doctors-grid"

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