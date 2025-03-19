"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import LoginDialog from "../components/login-dailog"

export default function Navbar() {
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  return (
    <header className="w-full border-b bg-white">
      <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center text-lg font-semibold">
            <span className="font-bold">Eazydoc</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary">
              Find Doctors
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary">
              Specialties
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary">
              About Us
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setShowLoginDialog(true)}>
            Login
          </Button>
          <Button className="bg-black text-white hover:bg-gray-800">Sign Up</Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
                <Link href="#" className="hover:text-primary">
                  Find Doctors
                </Link>
                <Link href="#" className="hover:text-primary">
                  Specialties
                </Link>
                <Link href="#" className="hover:text-primary">
                  About Us
                </Link>
                <Link href="#" className="hover:text-primary">
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </header>
  )
}

