import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import LabResultsList from "@/components/dashboard/lab-results-list"

export const metadata: Metadata = {
  title: "Lab Results",
  description: "View your laboratory test results",
}

export default function LabResultsPage() {
  return (
    <DashboardLayout>
      <LabResultsList />
    </DashboardLayout>
  )
}

