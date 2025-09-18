import AuthLayout from "@/modules/auth/ui/layouts/auth-layout";

/**
 * Wraps page content with the authentication layout.
 *
 * Renders the provided `children` inside the shared AuthLayout component used for auth-related pages.
 *
 * @param children - React nodes to render inside the authentication layout.
 * @returns A React element that nests `children` within AuthLayout.
 */
export default function Layout ({ children }: { children: React.ReactNode }) {
    return(
        <AuthLayout>
            {children}
        </AuthLayout>
    );
}


