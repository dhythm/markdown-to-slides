import { prisma } from "./prisma"
import { ApiError } from "./api/response"
import type { Session } from "next-auth"

export async function checkSubscription(session: Session | null) {
  if (!session?.user?.id) {
    throw ApiError.Unauthorized()
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
    },
  })

  if (!user?.stripeSubscriptionId || !user?.stripeCurrentPeriodEnd) {
    throw ApiError.SubscriptionRequired()
  }

  const isSubscriptionActive = user.stripeCurrentPeriodEnd.getTime() > Date.now()

  if (!isSubscriptionActive) {
    throw ApiError.SubscriptionExpired()
  }

  return true
} 