"use client"

import { withRoleAccess } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import AdminPatients from "@/components/admin/patients"

function PatientsPage() {
  return (
    <DashboardLayout>
      <AdminPatients />
    </DashboardLayout>
  )
}

export default withRoleAccess(PatientsPage, ['admin'])