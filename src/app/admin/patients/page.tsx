"use client"

import AdminDashboardLayout from "@/components/dashboard/admin-dashboard"
import AdminPatients from "@/components/admin/patients"

function PatientsPage() {
  return (
    <AdminDashboardLayout>
      <AdminPatients />
    </AdminDashboardLayout>
  )
}

export default PatientsPage