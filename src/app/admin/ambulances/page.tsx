"use client"

import AdminDashboardLayout from "@/components/dashboard/admin-dashboard"
import AdminAmbulances from "@/components/admin/ambulances"

function AmbulancesPage() {
  return (
    <AdminDashboardLayout>
      <AdminAmbulances />
    </AdminDashboardLayout>
  )
}

export default AmbulancesPage