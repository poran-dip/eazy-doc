"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import LoginDialog from "@/components/login-dailog"

export default function Navbar() {
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
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
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                  Eazydoc
                </Link>
                <Link href="/" className="hover:text-foreground/80">
                    Home
                </Link>
                <Link href="#" className="hover:text-foreground/80">
                  Find Doctors
                </Link>
                <Link href="#" className="hover:text-foreground/80">
                  Specialties
                </Link>
                <Link href="#" className="hover:text-foreground/80">
                  About Us
                </Link>
                <Link href="#" className="hover:text-foreground/80">
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 text-lg font-bold ">    
            <span>Eazydoc</span>
          </Link>
          <nav className="hidden md:flex gap-6 ml-6">
            <Link href="/" className="text-sm font-medium hover:text-foreground/80">
              Home
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-foreground/80">
              Services
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-foreground/80">
              Specialties
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-foreground/80">
              About Us
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-foreground/80">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowLoginDialog(true)}>
            Login
          </Button>
          <Button className="hidden md:inline-flex">Sign Up</Button>
        </div>
      </div>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </header>
  )
}

