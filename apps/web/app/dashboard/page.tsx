"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { SidebarProvider } from "@workspace/ui/components/sidebar";


export default function Page() {

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarProvider defaultOpen={true}>
        <DashboardSidebar />
      </SidebarProvider>
      <main className="flex-1 p-6">
        <header className="flex justify-center">
          <div className="flex items-center justify-between space-x-4">
            <UserButton />
            <OrganizationSwitcher hidePersonal />
          </div>
        </header>
      </main>
    </div>
  );
}