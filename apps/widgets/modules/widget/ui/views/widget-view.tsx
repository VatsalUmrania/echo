"use client"
import { WidgetAuthScreen } from "@/modules/widget/ui/screens/widget-auth-screen";
import { useAtomValue } from "jotai";
import { screenAtom } from "@/modules/widget/atoms/widget-atoms";

interface Props{
    organizationId: string
}

export const WidgetView = ({ organizationId }: Props) => {
    const screen = useAtomValue(screenAtom);

    const screenComponents = {
        error: <p>TODO : ERROR</p>,
        loading : <p>TODO : Loading</p>,
        auth: <WidgetAuthScreen/>,
        voice: <p>TODO : VOICE</p>,
        inbox: <p>TODO : INBOX</p>,
        selection: <p>TODO : SECLECTION</p>,
        chat: <p>TODO : CHAT</p>,
        contact: <p>TODO : CONTACT</p>,
    }
    return(
        <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
            {screenComponents[screen]}
        </main>
    );
}