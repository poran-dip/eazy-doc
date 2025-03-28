"use client"

import { withRoleAccess } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import DocAppointments from "@/components/doc/appointments"

function DoctorAppointments() {
  return (
    <DashboardLayout>
      <DocAppointments />
    </DashboardLayout>
  )
}

export default withRoleAccess(DoctorAppointments, ['doctor'])