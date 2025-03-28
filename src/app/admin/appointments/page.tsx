"use client"

import { withRoleAccess } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import AdminAppointments from "@/components/admin/appointments"

function AppointmentsPage() {
  return (
    <DashboardLayout>
      <AdminAppointments />
    </DashboardLayout>
  )
}

export default withRoleAccess(AppointmentsPage, ['admin'])