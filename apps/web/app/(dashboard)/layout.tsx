// import { DashboardLayout } from "@/modules/dashboard/ui/layouts/dashboard-layout";

// const Layout = ({children} : {children : React.ReactNode; }) => {
//     return (
//         <DashboardLayout>
//             {children}
//         </DashboardLayout>
//     );
// }
// export default Layout;
import { AuthGurad } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard";
import  DashboardLayout from "@/modules/dashboard/ui/layouts/dashboard-layout";


const Layout = ({children} : {children : React.ReactNode; }) => {
    return (
        <AuthGurad>
            <OrganizationGuard>
                <DashboardLayout>
                    {children}
                </DashboardLayout>
            </OrganizationGuard>
        </AuthGurad>
    );
}
export default Layout;