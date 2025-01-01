import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { BillingForm } from "@/components/billing/billing-form"
import { prisma } from "@/lib/prisma"

export default async function BillingPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    }
  })

  if (!user) {
    redirect("/auth/signin")
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <BillingForm
        subscriptionId={user?.stripeSubscriptionId}
        currentPeriodEnd={user?.stripeCurrentPeriodEnd}
      />
    </div>
  )
} 