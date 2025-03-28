"use client"

import PatientDashboardLayout from "@/components/dashboard/patient-dashboard"
import DashboardOverview from "@/components/dashboard/dashboard-overview"

function DashboardPage() {
  return (
    <PatientDashboardLayout>
      <DashboardOverview />
    </PatientDashboardLayout>
  )
}

export default DashboardPage