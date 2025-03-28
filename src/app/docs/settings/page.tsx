"use client"

import { withRoleAccess } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import DocSettings from "@/components/doc/settings"

function DoctorSettings() {
  return (
    <DashboardLayout>
      <DocSettings />
    </DashboardLayout>
  )
}

export default withRoleAccess(DoctorSettings, ['doctor'])