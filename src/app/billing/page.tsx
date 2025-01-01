import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { BillingForm } from "@/components/billing/billing-form"
import { prisma } from "@/lib/prisma"

export default async function BillingPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin?callbackUrl=/billing")
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCustomerId: true,
      stripeCurrentPeriodEnd: true,
    },
  })

  return (
    <div className="max-w-xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>
      <BillingForm
        subscriptionId={user?.stripeSubscriptionId}
        customerId={user?.stripeCustomerId}
        currentPeriodEnd={user?.stripeCurrentPeriodEnd}
      />
    </div>
  )
} 