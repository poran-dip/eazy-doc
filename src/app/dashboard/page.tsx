"use client"

import LoginDialog from "@/components/login-dialog"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import DashboardOverview from "@/components/dashboard/dashboard-overview"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/status")
        const data = await res.json()
        setIsAuthenticated(data.isLoggedIn)
        setRole(data.role)
      } catch (error) {
        console.error("Auth check failed:", error)
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-xl mb-4">
            Please log in to continue to dashboard
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => setShowLoginDialog(true)}>
              Login
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push("/")}
            >
              Back to Home
            </Button>
          </div>
          {showLoginDialog && (
            <LoginDialog 
              open={showLoginDialog} 
              onOpenChange={(open) => setShowLoginDialog(open)} 
            />
          )}
        </div>
      </div>
    )
  }

  if (role !== 'patient') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl mb-4">
            You're signed in as a doctor or admin, please log out and try again
          </h2>
          <Button onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  )
}