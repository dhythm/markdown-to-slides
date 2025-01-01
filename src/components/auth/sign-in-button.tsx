"use client"

import { useSession, signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"

export function SignInButton() {
  const { data: session } = useSession()

  if (session) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signIn()}
      className="gap-2"
    >
      <LogIn className="h-4 w-4" />
      Sign In
    </Button>
  )
} 