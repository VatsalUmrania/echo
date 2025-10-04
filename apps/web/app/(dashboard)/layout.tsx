
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard";
import  DashboardLayout from "@/modules/dashboard/ui/layouts/dashboard-layout";


const Layout = ({children} : {children : React.ReactNode; }) => {
    return (
        <AuthGuard>
            <OrganizationGuard>
                <DashboardLayout>
                    {children}
                </DashboardLayout>
            </OrganizationGuard>
        </AuthGuard>
    );
}
export default Layout;