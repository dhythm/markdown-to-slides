"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface BillingFormProps {
  subscriptionId?: string | null
  customerId?: string | null
  currentPeriodEnd?: Date | null
}

export function BillingForm({
  subscriptionId,
  customerId,
  currentPeriodEnd,
}: BillingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const isSubscribed = subscriptionId && currentPeriodEnd && currentPeriodEnd > new Date()

  async function handleSubscribe() {
    try {
      setLoading(true)
      const response = await fetch("/api/billing/subscription", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to create subscription")
      }

      const data = await response.json()
      router.push(data.url)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleManageBilling() {
    try {
      setLoading(true)
      const response = await fetch("/api/billing/portal", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to access billing portal")
      }

      const data = await response.json()
      router.push(data.url)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pro Plan</CardTitle>
        <CardDescription>
          Get access to AI features and enhance your presentations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4" />
          <span>AI-powered slide generation</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4" />
          <span>Smart slide enhancement suggestions</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4" />
          <span>Unlimited AI requests</span>
        </div>
        <div className="mt-6">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">$10</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <div className="mt-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
            <p className="text-sm font-medium text-primary">🎉 Limited Time Offer!</p>
            <p className="text-sm mt-1">Use code <span className="font-mono font-medium">Launch2025</span> for 49% lifetime discount</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {isSubscribed ? (
          <>
            <div className="w-full space-y-4">
              <div className="text-sm text-muted-foreground">
                Your plan renews on{" "}
                {currentPeriodEnd?.toLocaleDateString()}
              </div>
              <Button
                onClick={handleManageBilling}
                className="w-full"
                disabled={loading}
              >
                {loading ? "Loading..." : "Manage Subscription"}
              </Button>
            </div>
          </>
        ) : (
          <Button
            onClick={handleSubscribe}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Loading..." : "Upgrade to Pro"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
} 