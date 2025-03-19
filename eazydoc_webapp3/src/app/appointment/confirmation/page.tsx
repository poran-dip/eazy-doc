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
    <div className="container py-20 flex items-center justify-center mx-auto my-auto">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-3 sm:mb-4">
            <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500" />
          </div>
          <CardTitle className="text-xl sm:text-2xl">Appointment Confirmed!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 sm:mb-4 text-sm sm:text-base">
            Your appointment has been successfully scheduled. We have sent a confirmation email with all the details.
          </p>
          <div className="rounded-lg bg-muted p-3 sm:p-4 text-left">
            <p className="text-xs sm:text-sm mb-1">
              <strong>Doctor ID:</strong> {searchParams.doctor}
            </p>
            <p className="text-xs sm:text-sm mb-1">
              <strong>Confirmation #:</strong> {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </p>
            <p className="text-xs sm:text-sm">
              <strong>Status:</strong> <span className="text-green-600">Confirmed</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
            <Link href="/dashboard">View Appointments</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

