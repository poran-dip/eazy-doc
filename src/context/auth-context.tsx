"use client"

import React, { createContext, useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Define comprehensive user type
export interface UserProfile {
  id: string
  name: string
  email: string
  role: 'patient' | 'doctor' | 'admin'
  
  // Patient-specific fields
  patientId?: string
  dateOfBirth?: string
  medicalRecordNumber?: string

  // Doctor-specific fields
  doctorId?: string
  specialization?: string
  licenseNumber?: string

  // Admin-specific fields
  department?: string
}

// Authentication context interface
interface AuthContextType {
  isAuthenticated: boolean | null
  user: UserProfile | null
  role: 'patient' | 'doctor' | 'admin' | null
  
  // Extracted ID helpers
  patientId?: string
  doctorId?: string
  
  login: (credentials: any) => Promise<boolean>
  logout: () => Promise<void>
  isAuthorized: (allowedRoles: string[]) => boolean
  
  // Method to refresh user data
  refreshUserData: () => Promise<void>
}

// Create context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  user: null,
  role: null,
  patientId: undefined,
  doctorId: undefined,
  login: async () => false,
  logout: async () => {},
  isAuthorized: () => false,
  refreshUserData: async () => {}
})

// Authentication provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [role, setRole] = useState<'patient' | 'doctor' | 'admin' | null>(null)
  const router = useRouter()

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      const res = await fetch("/api/auth/status")
      const data = await res.json()
      
      if (data.isLoggedIn) {
        setIsAuthenticated(true)
        setUser(data.user)
        setRole(data.user.role)
      } else {
        setIsAuthenticated(false)
        setUser(null)
        setRole(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setIsAuthenticated(false)
      setUser(null)
      setRole(null)
    }
  }

  // Login method
  const login = async (credentials: any) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      })
      const data = await res.json()
      
      if (data.isLoggedIn) {
        setIsAuthenticated(true)
        setUser(data.user)
        setRole(data.user.role)
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  // Logout method
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setIsAuthenticated(false)
      setUser(null)
      setRole(null)
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // Check if user is authorized for specific roles
  const isAuthorized = (allowedRoles: string[]) => {
    return isAuthenticated === true && 
           role !== null && 
           allowedRoles.includes(role)
  }

  // Refresh user data
  const refreshUserData = async () => {
    await checkAuthStatus()
  }

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        role,
        patientId: user?.patientId,
        doctorId: user?.doctorId,
        login, 
        logout, 
        isAuthorized,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Example of how to use in a component
export const withRoleAccess = (
  WrappedComponent: React.ComponentType, 
  allowedRoles: string[]
) => {
  return (props: any) => {
    const { isAuthenticated, role, isAuthorized, user } = useAuth()
    const router = useRouter()

    useEffect(() => {
      // Redirect unauthenticated or unauthorized users
      if (isAuthenticated === false) {
        router.push("/")
      } else if (isAuthenticated && !isAuthorized(allowedRoles)) {
        router.push("/unauthorized")
      }
    }, [isAuthenticated, role])

    // Render loading state while checking authentication
    if (isAuthenticated === null) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      )
    }

    // Render component if authorized, passing user data as props
    return isAuthorized(allowedRoles) 
      ? <WrappedComponent {...props} user={user} /> 
      : null
  }
}