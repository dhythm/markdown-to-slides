import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ isSubscribed: false })
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

    const isSubscribed = !!(
      user?.stripeSubscriptionId &&
      user?.stripeCurrentPeriodEnd &&
      user.stripeCurrentPeriodEnd.getTime() > Date.now()
    )

    return NextResponse.json({ isSubscribed })
  } catch (error) {
    console.error("[CHECK_SUBSCRIPTION_ERROR]", error)
    return NextResponse.json({ isSubscribed: false })
  }
} 