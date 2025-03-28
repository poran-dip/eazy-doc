"use client"

import { withRoleAccess } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import DocHome from "@/components/doc/home"

function DoctorHomepage() {
  return (
    <DashboardLayout>
      <DocHome />
    </DashboardLayout>
  )
}

export default withRoleAccess(DoctorHomepage, ['doctor'])