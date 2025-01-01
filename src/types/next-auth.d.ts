import type { DefaultSession, JWT as NextAuthJWT } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT extends NextAuthJWT {
    id: string
    email: string
  }
} 