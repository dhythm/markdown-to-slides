"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function LogoutButton({ variant = "default" }: LogoutButtonProps) {
  return (
    <div className="w-full flex items-center gap-2">
      <LogOut className="h-4 w-4" />
      <span>Sign Out</span>
    </div>
  )
} 