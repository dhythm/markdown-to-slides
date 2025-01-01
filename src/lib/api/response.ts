import { NextResponse } from "next/server"

export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

export function successResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
  })
}

export function errorResponse(
  message: string,
  status: number = 500
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  )
}

export const ApiError = {
  Unauthorized: () => errorResponse("Unauthorized", 401),
  NotFound: () => errorResponse("Not Found", 404),
  BadRequest: (message: string) => errorResponse(message, 400),
  ServerError: (message: string = "Internal Server Error") =>
    errorResponse(message, 500),
  SubscriptionRequired: () =>
    errorResponse("Subscription required for this feature", 403),
  SubscriptionExpired: () =>
    errorResponse("Your subscription has expired", 403),
} 