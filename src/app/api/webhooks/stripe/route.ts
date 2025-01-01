import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion,
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature")

  if (!signature) {
    return new NextResponse("No signature found", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )
  } catch (err) {
    const error = err as Error
    console.error("Webhook signature verification failed:", error.message)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  console.log("Received Stripe webhook event:", event.type)

  const session = event.data.object as Stripe.Checkout.Session | Stripe.Subscription

  if (event.type === "checkout.session.completed") {
    console.log("Processing checkout.session.completed")
    try {
      const subscription = await stripe.subscriptions.retrieve(
        (session as Stripe.Checkout.Session).subscription as string
      )

      console.log("Updating user subscription:", {
        userId: session.metadata?.userId,
        subscriptionId: subscription.id,
        priceId: subscription.items.data[0].price.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      })

      await prisma.user.update({
        where: {
          id: session.metadata?.userId,
        },
        data: {
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      })

      console.log("Successfully updated user subscription")
    } catch (err) {
      const error = err as Error
      console.error("Error processing checkout.session.completed:", error)
      return new NextResponse("Error processing webhook", { status: 500 })
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    console.log("Processing invoice.payment_succeeded")
    try {
      const subscription = await stripe.subscriptions.retrieve(
        (session as Stripe.Subscription).id
      )

      console.log("Updating subscription renewal:", {
        subscriptionId: subscription.id,
        priceId: subscription.items.data[0].price.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      })

      await prisma.user.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      })

      console.log("Successfully updated subscription renewal")
    } catch (err) {
      const error = err as Error
      console.error("Error processing invoice.payment_succeeded:", error)
      return new NextResponse("Error processing webhook", { status: 500 })
    }
  }

  return new NextResponse(null, { status: 200 })
} 