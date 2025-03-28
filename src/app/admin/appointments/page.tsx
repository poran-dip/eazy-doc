"use client"

import AdminDashboardLayout from "@/components/dashboard/admin-dashboard"
import AdminAppointments from "@/components/admin/appointments"

function AppointmentsPage() {
  return (
    <AdminDashboardLayout>
      <AdminAppointments />
    </AdminDashboardLayout>
  )
}

export default AppointmentsPage