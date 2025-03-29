"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import LoginDialog from "@/components/login-dialog"

export default function Navbar() {
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(storedStatus === 'true');
  }, []);

  const handleOpenApp = () => {
    router.push('/dashboard')
  }

  return (
    <header className="w-full border-b bg-white">
      <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center text-lg font-semibold">
          <Image
            src="/logo.jpg"
            alt="Eazydoc Logo"
            width={32} // set appropriate width
            height={32} // set appropriate height
            className="h-8 w-auto mr-2 object-contain"
          />
            <span className="font-bold">Eazydoc</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/features" className="hover:text-foreground/80">
                  Features
                </Link>
                <Link href="/about" className="hover:text-foreground/80">
                  About Us
                </Link>
                <Link href="/docs/login" className="hover:text-foreground/80">
                  For Doctors
                </Link>
                <Link href="/ambulances" className="hover:text-foreground/80">
                  For Ambulances
                </Link>
                <Link href="/admin/login" className="hover:text-foreground/80">
                  For Admins
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <nav className="hidden md:flex gap-10 ml-4">
            <Link href="/features" className="text-sm font-medium hover:text-foreground/80">
              Features
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-foreground/80">
              About Us
            </Link>
            <Link href="/docs/login" className="text-sm font-medium hover:text-foreground/80">
              For Doctors
            </Link>
            <Link href="/ambulances" className="text-sm font-medium hover:text-foreground/80">
              For Ambulances
            </Link>
            <Link href="/admin/login" className="text-sm font-medium hover:text-foreground/80">
              For Admins
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Button onClick={handleOpenApp}>Open App</Button>
          ) : (
            <Button variant="outline" onClick={() => setShowLoginDialog(true)}>
              Login
            </Button>
          )}
        </div>
      </div>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </header>
  )
}