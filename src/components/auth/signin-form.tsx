"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setErrorMessage("Invalid email or password")
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setErrorMessage("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6 px-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Sign In</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to sign in to your account
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        {errorMessage && (
          <div className="text-sm text-destructive text-center">
            {errorMessage}
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-medium underline underline-offset-4 hover:text-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
} 