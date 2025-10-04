// "use client"

// import { api } from "@workspace/backend/_generated/api";
// import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
// import { Button } from "@workspace/ui/components/button";
// import { useMutation, useQuery } from "convex/react";
// import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";

// export default function Page() {
//   const users = useQuery(api.user.getMany, {});
//   const addUser = useMutation(api.user.add);

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <DashboardSidebar />

//       {/* Main content */}
//       <div className="flex-1 p-6 space-y-6">
//         {/* Header Section */}
//         <div className="flex flex-col justify-between items-center mb-6">
//           <div className="flex space-x-4">
//             <UserButton />
//             <OrganizationSwitcher hidePersonal />
//           </div>
//         </div>

//         {/* Add User Button */}
//         <div className="flex justify-center">
//           <Button
//             onClick={async () => {
//               await addUser({});
//             }}
//             className="w-1/2 md:w-1/3 lg:w-1/4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
//           >
//             Add User
//           </Button>
//         </div>

//         {/* User List */}
//         <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
//           <h2 className="text-xl font-semibold text-gray-700">Users</h2>
//           <div className="space-y-4">
//             <div className="max-w-full overflow-auto">
//               {JSON.stringify(users)}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { api } from "@workspace/backend/_generated/api";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { SidebarProvider } from "@workspace/ui/components/sidebar";

export default function Page() {
  const users = useQuery(api.user.getMany, {});
  const addUser = useMutation(api.user.add);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Wrap the sidebar in SidebarProvider */}
      <SidebarProvider defaultOpen={true}>
        <DashboardSidebar />
      </SidebarProvider>

      {/* Main content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col justify-between items-center mb-6">
          <div className="flex space-x-4">
            <UserButton />
            <OrganizationSwitcher hidePersonal />
          </div>
        </div>

        {/* Add User Button */}
        <div className="flex justify-center">
          <Button
            onClick={async () => {
              await addUser({});
            }}
            className="w-1/2 md:w-1/3 lg:w-1/4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Add User
          </Button>
        </div>

        {/* User List */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Users</h2>
          <div className="space-y-4">
            <div className="max-w-full overflow-auto">
              {users ? (
                <pre className="whitespace-pre-wrap break-words text-sm text-gray-800">
                  {JSON.stringify(users, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500">Loading users...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
