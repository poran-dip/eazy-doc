import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import AppointmentsList from "@/components/dashboard/appointment-list"

export const metadata: Metadata = {
  title: "My Appointments",
  description: "View and manage your upcoming and past appointments",
}

export default function AppointmentsPage() {
  return (
    <DashboardLayout>
      <AppointmentsList />
    </DashboardLayout>
  )
}

