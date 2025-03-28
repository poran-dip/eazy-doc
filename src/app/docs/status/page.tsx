"use client"

import { withRoleAccess } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import DocStatus from "@/components/doc/status"

function DoctorStatus() {
  return (
    <DashboardLayout>
      <DocStatus />
    </DashboardLayout>
  )
}

export default withRoleAccess(DoctorStatus, ['doctor'])