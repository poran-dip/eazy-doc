"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [activeTab, setActiveTab] = useState("login")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-4 sm:p-6 max-w-[90vw]">
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="text-xs sm:text-sm">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="text-xs sm:text-sm">
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Login to your account</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Enter your email and password to access your account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="email" className="text-xs sm:text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="text-xs sm:text-sm h-8 sm:h-10"
                />
              </div>
              <div className="grid gap-1 sm:gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs sm:text-sm">
                    Password
                  </Label>
                  <Link href="#" className="text-xs sm:text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" className="text-xs sm:text-sm h-8 sm:h-10" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full text-xs sm:text-sm h-8 sm:h-10">
                Login
              </Button>
            </DialogFooter>

            <div className="relative my-3 sm:my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full text-xs sm:text-sm h-8 sm:h-10" type="button">
              <svg viewBox="0 0 24 24" className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true">
                <path
                  d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z"
                  fill="#34A853"
                />
              </svg>
              Sign in with Google
            </Button>

            <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm">
              Don&apos;t have an account?{" "}
              <button onClick={() => setActiveTab("register")} className="text-primary hover:underline">
                Sign up
              </button>
            </div>
          </TabsContent>
          <TabsContent value="register">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Create an account</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Fill in the information below to create your account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="name" className="text-xs sm:text-sm">
                  Full Name
                </Label>
                <Input id="name" placeholder="John Doe" className="text-xs sm:text-sm h-8 sm:h-10" />
              </div>
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="register-email" className="text-xs sm:text-sm">
                  Email
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="name@example.com"
                  className="text-xs sm:text-sm h-8 sm:h-10"
                />
              </div>
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="register-password" className="text-xs sm:text-sm">
                  Password
                </Label>
                <Input id="register-password" type="password" className="text-xs sm:text-sm h-8 sm:h-10" />
              </div>
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="confirm-password" className="text-xs sm:text-sm">
                  Confirm Password
                </Label>
                <Input id="confirm-password" type="password" className="text-xs sm:text-sm h-8 sm:h-10" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full text-xs sm:text-sm h-8 sm:h-10">
                Create Account
              </Button>
            </DialogFooter>

            <div className="relative my-3 sm:my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full text-xs sm:text-sm h-8 sm:h-10" type="button">
              <svg viewBox="0 0 24 24" className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true">
                <path
                  d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z"
                  fill="#34A853"
                />
              </svg>
              Sign up with Google
            </Button>

            <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm">
              Already have an account?{" "}
              <button onClick={() => setActiveTab("login")} className="text-primary hover:underline">
                Login
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

