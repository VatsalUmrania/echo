"use client"

import {useQuery} from "convex/react";
import {api} from "@workspace/backend/_generated/api";
export default function Page() {
  const users = useQuery(api.user.getMany, {});
  return (
    <div className="flex items-center justify-center min-h-svh">
      <p>apps/web</p>
      <div className="max-w-sm p-4 ">
        {JSON.stringify(users)}
      </div>
      
    </div>
  )
 }
