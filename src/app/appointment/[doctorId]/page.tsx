"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function AppointmentPage({ params }: { params: { doctorId: string } }) {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    medicalHistory: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calendarView, setCalendarView] = useState<"date" | "month" | "year">("date")
  const [calendarDate, setCalendarDate] = useState<Date>(new Date())

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, you would send this data to your backend
    console.log("Appointment booked with:", {
      doctorId: params.doctorId,
      appointmentDate: date,
      patientInfo: formData,
    })

    // Redirect to confirmation page
    router.push(`/appointment/confirmation?doctor=${params.doctorId}`)
  }

  // Custom calendar navigation components
  const CalendarHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    view,
    setView,
  }: {
    date: Date
    decreaseMonth: () => void
    increaseMonth: () => void
    view: "date" | "month" | "year"
    setView: (view: "date" | "month" | "year") => void
  }) => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={decreaseMonth}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            onClick={() => setView("month")}
            className={cn("text-sm font-medium", view === "month" && "bg-muted")}
          >
            {format(date, "MMMM")}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setView("year")}
            className={cn("text-sm font-medium", view === "year" && "bg-muted")}
          >
            {format(date, "yyyy")}
          </Button>
        </div>
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={increaseMonth}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>
    )
  }

  const MonthsView = ({
    date,
    setDate,
    setView,
  }: {
    date: Date
    setDate: (date: Date) => void
    setView: (view: "date" | "month" | "year") => void
  }) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    const handleMonthSelect = (monthIndex: number) => {
      const newDate = new Date(date)
      newDate.setMonth(monthIndex)
      setDate(newDate)
      setView("date")
    }

    return (
      <div className="p-2">
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, index) => (
            <Button
              key={month}
              variant="outline"
              className={cn("h-10", date.getMonth() === index && "bg-primary text-primary-foreground")}
              onClick={() => handleMonthSelect(index)}
            >
              {month.substring(0, 3)}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  const YearsView = ({
    date,
    setDate,
    setView,
    minYear = new Date().getFullYear() - 100,
    maxYear = new Date().getFullYear(),
  }: {
    date: Date
    setDate: (date: Date) => void
    setView: (view: "date" | "month" | "year") => void
    minYear?: number
    maxYear?: number
  }) => {
    const currentYear = date.getFullYear()
    const startYear = Math.floor(currentYear / 12) * 12

    const years = Array.from({ length: 12 }, (_, i) => {
      const year = startYear + i
      return year >= minYear && year <= maxYear ? year : null
    }).filter(Boolean) as number[]

    const handleYearSelect = (year: number) => {
      const newDate = new Date(date)
      newDate.setFullYear(year)
      setDate(newDate)
      setView("month")
    }

    return (
      <div className="p-2">
        <div className="flex justify-between mb-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => {
              const newDate = new Date(date)
              newDate.setFullYear(currentYear - 12)
              setDate(newDate)
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            {years[0]} - {years[years.length - 1]}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => {
              const newDate = new Date(date)
              newDate.setFullYear(currentYear + 12)
              setDate(newDate)
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {years.map((year) => (
            <Button
              key={year}
              variant="outline"
              className={cn("h-10", date.getFullYear() === year && "bg-primary text-primary-foreground")}
              onClick={() => handleYearSelect(year)}
            >
              {year}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  const CustomCalendar = ({
    selected,
    onSelect,
    disabled,
    minYear,
    maxYear,
  }: {
    selected?: Date
    onSelect: (date: Date | undefined) => void
    disabled?: (date: Date) => boolean
    minYear?: number
    maxYear?: number
  }) => {
    const [view, setView] = useState<"date" | "month" | "year">("date")
    const [viewDate, setViewDate] = useState<Date>(selected || new Date())

    const handleDateSelect = (date: Date | undefined) => {
      onSelect(date)
      if (date) {
        setViewDate(date)
      }
    }

    return (
      <div className="p-1">
        <CalendarHeader
          date={viewDate}
          decreaseMonth={() => {
            const newDate = new Date(viewDate)
            newDate.setMonth(viewDate.getMonth() - 1)
            setViewDate(newDate)
          }}
          increaseMonth={() => {
            const newDate = new Date(viewDate)
            newDate.setMonth(viewDate.getMonth() + 1)
            setViewDate(newDate)
          }}
          view={view}
          setView={setView}
        />

        {view === "date" && (
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleDateSelect}
            month={viewDate}
            onMonthChange={setViewDate}
            disabled={disabled}
            className="border-none"
            components={{
              Head: () => null, // Hide the default header
            }}
          />
        )}

        {view === "month" && <MonthsView date={viewDate} setDate={setViewDate} setView={setView} />}

        {view === "year" && (
          <YearsView date={viewDate} setDate={setViewDate} setView={setView} minYear={minYear} maxYear={maxYear} />
        )}
      </div>
    )
  }

  return (
    <div className="container py-10 mx-auto h-fit-content max-w-6xl">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl">Book Your Appointment</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Please fill out the form below to schedule your appointment.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="firstName" className="text-xs sm:text-sm">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="text-xs sm:text-sm h-8 sm:h-10"
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="lastName" className="text-xs sm:text-sm">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="text-xs sm:text-sm h-8 sm:h-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="dob" className="text-xs sm:text-sm">
                    Date of Birth
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal text-xs sm:text-sm h-8 sm:h-10",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        {date ? format(date, "PPP") : "Select your date of birth"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CustomCalendar
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date > new Date()}
                        minYear={new Date().getFullYear() - 100}
                        maxYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="phone" className="text-xs sm:text-sm">
                    Contact Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="text-xs sm:text-sm h-8 sm:h-10"
                  />
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="text-xs sm:text-sm h-8 sm:h-10"
                />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium">Medical Information</h3>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="medicalHistory" className="text-xs sm:text-sm">
                  Medical History (allergies, conditions, medications)
                </Label>
                <Textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  placeholder="Please share any relevant medical information that might be important for your doctor to know."
                  className="min-h-[80px] sm:min-h-[120px] text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium">Appointment Date</h3>
              <div className="space-y-1 sm:space-y-2">
                <Label className="text-xs sm:text-sm">Select Preferred Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal text-xs sm:text-sm h-8 sm:h-10",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      {date ? format(date, "PPP") : "Select appointment date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CustomCalendar
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return date < today
                      }}
                      minYear={new Date().getFullYear()}
                      maxYear={new Date().getFullYear() + 5}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 sm:p-6">
            <Button type="submit" className="w-full text-xs sm:text-sm h-8 sm:h-10" disabled={isSubmitting || !date}>
              {isSubmitting ? "Processing..." : "Book Appointment"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

