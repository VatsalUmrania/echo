"use client"
import { Authenticated, Unauthenticated, useQuery ,useMutation} from "convex/react";
import {api} from "@workspace/backend/_generated/api";
import { SignInButton, UserButton } from "@clerk/nextjs";
import {Button} from "@workspace/ui/components/button"
export default function Page() {
  const users = useQuery(api.user.getMany, {});
  const addUser = useMutation(api.user.add);
  return (
    <>
          <Authenticated>
        <div className="flex items-center justify-center min-h-svh">
          <p>apps/web</p>
          <UserButton></UserButton>

          <Button onClick={async () => {
        await addUser({});
      }} className="m-4">
        Add User
      </Button>
          <div className="max-w-sm p-4 ">
            {JSON.stringify(users)}
          </div>
          
        </div>
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
