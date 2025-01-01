"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { User, CreditCard } from "lucide-react"
import { LogoutButton } from "./logout-button"

export function UserMenu() {
  const { data: session } = useSession()

  if (!session?.user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "User avatar"}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <User className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/billing">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Billing</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/auth/signin" })}>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 