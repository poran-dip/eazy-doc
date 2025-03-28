"use client"

import PatientDashboardLayout from "@/components/dashboard/patient-dashboard"
import AppointmentsList from "@/components/dashboard/appointment-list"

function AppointmentsPage() {
  return (
    <PatientDashboardLayout>
      <AppointmentsList />
    </PatientDashboardLayout>
  )
}

export default AppointmentsPage