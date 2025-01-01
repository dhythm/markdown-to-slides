import type { Metadata } from "next";
import { ThemeProvider } from "./providers";
import "./globals.css";
import 'katex/dist/katex.min.css';
import { UserMenu } from "@/components/auth/user-menu";
import { SignInButton } from "@/components/auth/sign-in-button";
import { Toaster } from "sonner";
import { validateEnv } from "@/lib/env";

// Validate environment variables
validateEnv();

export const metadata: Metadata = {
  title: "Markdown to Slides",
  description: "Convert your markdown to beautiful slides",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 items-center justify-between">
                  <div className="flex-1 flex justify-start">
                    <a className="flex items-center space-x-2" href="/">
                      <span className="font-bold">Markdown to Slides</span>
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <SignInButton />
                    <UserMenu />
                  </div>
                </div>
              </div>
            </header>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="max-w-6xl mx-auto">
                {children}
              </div>
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
