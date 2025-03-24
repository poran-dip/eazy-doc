import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import DashboardOverview from "@/components/dashboard/dashboard-overview"

export const metadata: Metadata = {
  title: "Patient Dashboard",
  description: "View your appointments and medical records",
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  )
}

