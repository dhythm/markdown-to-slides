import { serverSchema, clientSchema, type ServerEnv } from "./schema"

export const env = {} as ServerEnv

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ServerEnv {}
  }
}

export function validateEnv() {
  if (typeof process === "undefined") {
    throw new Error("This can only be called on the server side")
  }

  const parsed = serverSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    )
    throw new Error("Invalid environment variables")
  }

  // Only validate client-side env vars in development
  if (process.env.NODE_ENV !== "production") {
    const clientParsed = clientSchema.safeParse(process.env)

    if (!clientParsed.success) {
      console.error(
        "❌ Invalid public environment variables:",
        clientParsed.error.flatten().fieldErrors
      )
      throw new Error("Invalid public environment variables")
    }
  }

  Object.assign(env, parsed.data)
} 