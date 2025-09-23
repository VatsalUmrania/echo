"use client"

import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { atom ,useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon } from "lucide-react";
import { contactSessionIdAtomFamily, conversationIdAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

export const WidgetChatScreen = () => {

    const setScreen = useSetAtom(screenAtom);
    const setConversationId = useSetAtom(conversationIdAtom);
    const conversationId = useAtomValue(conversationIdAtom);
    const organizationId = useAtomValue(organizationIdAtom);
    const contactSessionAtom = organizationId
    ? contactSessionIdAtomFamily(organizationId)
    : atom(null);
    const contactSessionId = useAtomValue(contactSessionAtom);
    const conversation = useQuery(
        api.public.conversations.getOne,
        conversationId && contactSessionId
        ? {
            conversationId,
            contactSessionId,
        } : "skip"
    );

    const onBack = () => {
        setConversationId(null);
        setScreen("selection");
    }
    console.log("conversationId:", conversationId);
    console.log("contactSessionId:", contactSessionId);

    return(
        <>
            <WidgetHeader className="flex items-center justify-between">
                <div className="flex  justify-between gap-x-2">
                    <Button
                        size="icon"
                        variant="transparent"
                        onClick={onBack}
                    >
                        <ArrowLeftIcon/>
                    </Button>
                    <p>Chat</p>
                </div>
                <Button
                    size="icon"
                    variant="transparent"
                >
                </Button>
            </WidgetHeader>
            <div className="flex flex-1 flex-col gap-y-4 p-4">
                {JSON.stringify(conversation)}          
            </div>
        </>
    );
} 