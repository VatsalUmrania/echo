import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})
export const metadata = {
  title: "Echo Widget",
  description: "Your app description",
  icons: {
    icon: "/logo.svg", 
  },
}
/**
 * Application root layout that configures fonts, metadata, and wraps page content with app providers.
 *
 * @param children - The React node rendered as the page content inside Providers and a full-viewport container.
 * @returns The top-level HTML structure (<html>, <head>, <body>) with configured font variables, favicon, and Providers-wrapped children.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg"/>
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <div className="w-screen h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}