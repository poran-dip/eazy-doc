"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      console.error('Authentication error:', error)
      router.push('/?error=' + error)
    } else {
      router.push('/dashboard')
    }
  }, [searchParams, router])

  return null
}