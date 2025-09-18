"use client"
import { Authenticated, Unauthenticated, useQuery ,useMutation} from "convex/react";
import {api} from "@workspace/backend/_generated/api";
import { OrganizationSwitcher, SignInButton, UserButton } from "@clerk/nextjs";
import {Button} from "@workspace/ui/components/button"
/**
  * Root client page component that shows authenticated app controls or a sign-in prompt.
  *
  * When the user is authenticated this component:
  * - fetches a list of users via a Convex query and displays the raw JSON result,
  * - renders Clerk UI controls (UserButton and OrganizationSwitcher),
  * - provides an "Add User" button that calls a Convex mutation to create a user.
  *
  * When unauthenticated it shows a prompt and a sign-in button.
  *
  * @returns The page's JSX element.
  */
 export default function Page() {
  const users = useQuery(api.user.getMany, {});
  const addUser = useMutation(api.user.add);
  return (
    <>
          <Authenticated>
        <div className="flex items-center justify-center min-h-svh">
          <p>apps/web</p>
          <UserButton></UserButton>
          <OrganizationSwitcher hidePersonal/>
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
