"use client"

import PatientDashboardLayout from "@/components/dashboard/patient-dashboard"
import LabResultsList from "@/components/dashboard/lab-results-list"

function LabResultsPage() {
  return (
    <PatientDashboardLayout>
      <LabResultsList />
    </PatientDashboardLayout>
  )
}

export default LabResultsPage