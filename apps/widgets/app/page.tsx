"use client"

import {useQuery , useMutation} from "convex/react";
import {api} from "@workspace/backend/_generated/api";
import {Button} from "@workspace/ui/components/button"
export default function Page() {
  const users = useQuery(api.user.getMany, {});
  const addUser = useMutation(api.user.add);
  return (
    <div className="flex items-center justify-center min-h-svh">
      <p>apps/widgets</p>
      <Button onClick={async () => {
        await addUser({});
      }} className="m-4">
        Add User
      </Button>
      <div className="max-w-sm p-4 ">
        {JSON.stringify(users)}
      </div>
      
    </div>
  )
 }
