"use client"

import { LogOut } from "lucide-react"

export function LogoutButton() {
  return (
    <div className="w-full flex items-center gap-2">
      <LogOut className="h-4 w-4" />
      <span>Sign Out</span>
    </div>
  )
} 