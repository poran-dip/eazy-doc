"use client"

import { withRoleAccess } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import AdminDoctors from "@/components/admin/doctors"

function DoctorsPage() {
  return (
    <DashboardLayout>
      <AdminDoctors />
    </DashboardLayout>
  )
}

export default withRoleAccess(DoctorsPage, ['admin'])