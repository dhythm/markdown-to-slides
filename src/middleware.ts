import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Allow access to the main editor page
    if (req.nextUrl.pathname === "/") {
      return NextResponse.next()
    }

    // Check if trying to access AI features
    if (req.nextUrl.pathname.startsWith("/api/ai") && !req.nextauth.token) {
      return new NextResponse("Authentication required", { status: 401 })
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to the main editor
        if (req.nextUrl.pathname === "/") {
          return true
        }
        // Require auth for AI routes
        if (req.nextUrl.pathname.startsWith("/api/ai")) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - auth (auth pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
} 