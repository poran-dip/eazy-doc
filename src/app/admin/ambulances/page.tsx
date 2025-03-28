"use client"

import { withRoleAccess } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import AdminAmbulances from "@/components/admin/ambulances"

function AmbulancesPage() {
  return (
    <DashboardLayout>
      <AdminAmbulances />
    </DashboardLayout>
  )
}

export default withRoleAccess(AmbulancesPage, ['admin'])