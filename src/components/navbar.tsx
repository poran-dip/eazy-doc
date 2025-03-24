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
                <Link href="/" className="hover:text-foreground/80">
                  Home
                </Link>
                <Link href="#" className="hover:text-foreground/80">
                  Services
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
                <Link href="/docs" className="hover:text-foreground/80">
                  Eazydoc for Docs
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <nav className="hidden md:flex gap-8 ml-4">
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
            <Link href="/docs" className="text-sm font-medium hover:text-foreground/80">
              Eazydoc for Docs
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