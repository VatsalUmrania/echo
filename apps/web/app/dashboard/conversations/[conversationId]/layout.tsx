import { ConverssationIdLayout } from "@/modules/dashboard/ui/layouts/conversation-id-layout";

const Layout = ({children} : { children: React.ReactNode; }) => {
    return(
        <ConverssationIdLayout>
            {children}
        </ConverssationIdLayout>
    )
}

export default Layout;