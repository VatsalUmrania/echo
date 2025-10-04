// import { AuthGuard } from "@/modules/auth/ui/components/auth-guard"
// import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard";
// import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";  
// import { SidebarProvider } from "@workspace/ui/components/sidebar";
// import { cookies } from "next/headers";


// export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
//     const cookieStore = await cookies();
//     const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
   
//     return(
//         <AuthGuard>
//             <OrganizationGuard>
//                 <SidebarProvider defaultOpen={defaultOpen}>
//                 <DashboardSidebar/>
//                     <main className="flex-1 overflow-y-auto">
//                         {children}
//                     </main>
//                 </SidebarProvider>
//             </OrganizationGuard>
//         </AuthGuard>
//     );
// }

import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <AuthGuard>
      <OrganizationGuard>
        <SidebarProvider defaultOpen={defaultOpen}>
          <div className="flex h-screen w-screen overflow-hidden">
            <DashboardSidebar />
            <main className="flex min-w-0 flex-1 overflow-hidden">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </OrganizationGuard>
    </AuthGuard>
  );
}
