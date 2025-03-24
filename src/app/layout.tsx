
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { BackgroundBeams } from "@/components/ui/background-beams";
import { AuroraBackground } from "@/components/ui/aurora_background";
import AuthProvider from "@/components/providers/session-provider";

const inter = Inter();

export const metadata: Metadata = {
  title: "EZ Doc",
  description: "Prisma dev testing",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
