import { toast } from "sonner"

export async function checkSubscription() {
  try {
    const response = await fetch("/api/billing/check-subscription")
    const data = await response.json()
    return data.isSubscribed
  } catch (error) {
    console.error("Error checking subscription:", error)
    return false
  }
}

export function showUpgradePrompt() {
  toast.error("Pro Feature Required", {
    description: "Upgrade your account to access this feature. Use code Launch2025 for 49% lifetime discount!",
    action: {
      label: "Upgrade Now",
      onClick: () => window.location.href = "/billing",
    },
    duration: 8000,
  })
}

export async function handleProFeature(action: () => Promise<void>): Promise<boolean> {
  try {
    const hasSubscription = await checkSubscription()
    if (!hasSubscription) {
      showUpgradePrompt()
      return false
    }

    await action()
    return true
  } catch (error) {
    if (error instanceof Error && error.message.includes("subscription")) {
      showUpgradePrompt()
      return false
    }
    toast.error("Something went wrong. Please try again.", {
      duration: 3000,
    })
    return false
  }
} 