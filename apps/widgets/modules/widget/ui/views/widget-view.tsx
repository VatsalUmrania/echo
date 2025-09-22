"use client"
import { WidgetAuthScreen } from "@/modules/widget/ui/screens/widget-auth-screen";
import { useAtomValue } from "jotai";
import { screenAtom } from "@/modules/widget/atoms/widget-atoms";
import { WidgetErrorScreen } from "@/modules/widget/ui/screens/widget-error-screen";
import { WidgetLoadingScreen } from "../screens/widget-loading-screen";

interface Props{
    organizationId: string | null;
}

export const WidgetView = ({ organizationId }: Props) => {
    const screen = useAtomValue(screenAtom);

    const screenComponents = {
        error: <WidgetErrorScreen/>,
        loading : <WidgetLoadingScreen organizationId={organizationId}/>,
        auth: <WidgetAuthScreen/>,
        voice: <p>TODO : VOICE</p>,
        inbox: <p>TODO : INBOX</p>,
        selection: <p>TODO : SELECTION</p>,
        chat: <p>TODO : CHAT</p>,
        contact: <p>TODO : CONTACT</p>,
    }
    return(
        <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
            {screenComponents[screen]}
        </main>
    );
}