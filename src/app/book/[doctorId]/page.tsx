"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"

export default function PatientAppointmentRegistrationPage({ params }: { params: { doctorId: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    specialization: "",
    condition: "",
    description: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check for doctor cookie when component mounts
  const doctorId = Cookies.get('selectedDoctorId')

  // If no doctor cookie, redirect back to doctor search
  if (!doctorId) {
    router.push('/doctors')
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear any previous errors
    setError(null)
  }

  const handleSpecializationChange = (value: string) => {
    setFormData((prev) => ({ ...prev, specialization: value }))
  }

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }))
  }

  const validateForm = () => {
    // Basic form validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validate form before submission
    if (!validateForm()) {
      setIsSubmitting(false)
      return
    }

    try {
      // First, create a new patient
      const patientResponse = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: `${formData.firstName} ${formData.lastName}`,
          age: parseInt(formData.age) || undefined,
          gender: formData.gender
        })
      })

      if (!patientResponse.ok) {
        const errorData = await patientResponse.json()
        throw new Error(errorData.error || 'Failed to create patient')
      }

      const patient = await patientResponse.json()

      // Then, create a new appointment
      const appointmentResponse = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patient.id,
          doctorId: doctorId,
          specialization: formData.specialization,
          condition: formData.condition,
          description: formData.description,
          status: 'NEW'
        })
      })

      if (!appointmentResponse.ok) {
        const errorData = await appointmentResponse.json()
        throw new Error(errorData.error || 'Failed to book appointment')
      }

      // Clear the doctor cookie
      Cookies.remove('selectedDoctorId')

      // Redirect to confirmation page
      router.push('/appointment/confirmation')
    } catch (error: any) {
      console.error('Registration and booking error:', error)
      setError(error.message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10 mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Patient Registration & Appointment</CardTitle>
          <CardDescription>
            Create your account and book an appointment in one step
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Email *</Label>
              <Input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Password *</Label>
                <Input 
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Confirm Password *</Label>
                <Input 
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone Number *</Label>
                <Input 
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Age</Label>
                <Input 
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="0"
                  max="120"
                />
              </div>
            </div>

            <div>
              <Label>Gender</Label>
              <Select 
                value={formData.gender}
                onValueChange={handleGenderChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                  <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Specialization *</Label>
              <Select 
                value={formData.specialization}
                onValueChange={handleSpecializationChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Dermatology">Dermatology</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Condition</Label>
              <Input 
                name="condition"
                value={formData.condition}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide additional details about your appointment"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Create Account & Book Appointment'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Terms of Service</DialogTitle>
                  <DialogDescription>
                    By creating an account and booking an appointment, you agree to our terms of service and privacy policy.
                  </DialogDescription>
                </DialogHeader>
                {/* You can add more detailed terms here */}
                <div className="space-y-4">
                  <p>1. Your personal information will be kept confidential.</p>
                  <p>2. Medical information is protected under HIPAA guidelines.</p>
                  <p>3. You consent to sharing your information with the selected healthcare provider.</p>
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}