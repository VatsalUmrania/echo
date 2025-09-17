import { AuthGurad } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard";
import { Organization } from "@clerk/nextjs/server";

const Layout = ({children} : {children : React.ReactNode; }) => {
    return (
        <AuthGurad>
            <OrganizationGuard>
                {children}
            </OrganizationGuard>
        </AuthGurad>
    );
}
export default Layout;