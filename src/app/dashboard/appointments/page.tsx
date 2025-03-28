"use client"

import { withRoleAccess } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import AppointmentsList from "@/components/dashboard/appointment-list"

function AppointmentsPage() {
  return (
    <DashboardLayout>
      <AppointmentsList />
    </DashboardLayout>
  )
}

export default withRoleAccess(AppointmentsPage, ['patient'])