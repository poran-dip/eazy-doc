"use client"

import AdminDashboardLayout from "@/components/dashboard/admin-dashboard"
import AdminDoctors from "@/components/admin/doctors"

function DoctorsPage() {
  return (
    <AdminDashboardLayout>
      <AdminDoctors />
    </AdminDashboardLayout>
  )
}

export default DoctorsPage