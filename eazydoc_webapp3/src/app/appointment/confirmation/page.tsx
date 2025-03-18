import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfirmationPage({
  searchParams,
}: {
  searchParams: { doctor: string }
}) {
  return (
    <div className="container max-w-md mx-auto py-20">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Appointment Confirmed!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Your appointment has been successfully scheduled. We have sent a confirmation email with all the details.
          </p>
          <div className="rounded-lg bg-muted p-4 text-left">
            <p className="text-sm mb-1">
              <strong>Doctor ID:</strong> {searchParams.doctor}
            </p>
            <p className="text-sm mb-1">
              <strong>Confirmation #:</strong> {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </p>
            <p className="text-sm">
              <strong>Status:</strong> <span className="text-green-600">Confirmed</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">View Appointments</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

