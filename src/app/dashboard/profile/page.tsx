"use client"

import { withRoleAccess } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ProfileForm from "@/components/dashboard/profile-form"

function ProfileFormPage() {
  return (
    <DashboardLayout>
      <ProfileForm />
    </DashboardLayout>
  )
}

export default withRoleAccess(ProfileFormPage, ['patient'])