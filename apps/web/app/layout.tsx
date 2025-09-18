import { Geist, Geist_Mono } from "next/font/google"
import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import { ClerkProvider } from '@clerk/nextjs'

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

/**
 * Root layout for the application that applies global fonts and styles, and wraps content with authentication and app providers.
 *
 * @param children - React node(s) to render inside the layout.
 * @returns The root HTML structure containing `children` wrapped by `ClerkProvider` and `Providers`.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <ClerkProvider>
          <Providers>
              {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}
