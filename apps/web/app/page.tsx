"use client"
import { Authenticated, Unauthenticated, useQuery ,useMutation} from "convex/react";
import { OrganizationSwitcher, SignInButton, UserButton } from "@clerk/nextjs";
import DashboardPage from "./(dashboard)/page";

export default function Page() {
  return (
    <>
      <Authenticated>
        <DashboardPage />
      </Authenticated>
      <Unauthenticated>
        <div className="flex items-center justify-center min-h-svh">
          <p className="m-4">Please sign in</p>
          <SignInButton>Sign in</SignInButton>
        </div>
      </Unauthenticated>
    </>
  )
 }
