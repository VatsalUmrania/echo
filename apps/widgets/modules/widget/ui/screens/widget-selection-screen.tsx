"use client"

import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { atom ,useAtomValue, useSetAtom } from "jotai";
import { ChevronRightIcon, MessageSquareText, MicIcon, PhoneCallIcon } from "lucide-react";
import { contactSessionIdAtomFamily, conversationIdAtom, errorMessageAtom, hasVapiSecretAtom, organizationIdAtom, screenAtom, vapiSecretsAtom, widgetSettingsAtom  } from "@/modules/widget/atoms/widget-atoms";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";
import { WidgetFooter } from "@/modules/widget/ui/components/widget-footer";

export const WidgetSelectionScreen = () => {
    const setScreen = useSetAtom(screenAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const organizationId = useAtomValue(organizationIdAtom);
    const contactSessionAtom = organizationId
    ? contactSessionIdAtomFamily(organizationId)
    : atom(null);

    const widgetSettings = useAtomValue(widgetSettingsAtom);
    const hasVapiSecrets = useAtomValue(hasVapiSecretAtom);
    const setConversationId = useSetAtom(conversationIdAtom);
    const contactSessionId = useAtomValue(contactSessionAtom);
    const createConversation = useMutation(api.public.conversations.create);
    const [isPending, setIspending] = useState(false);
    
    const handleNewConversation = async() => {
        if(!organizationId){
            setScreen("error");
            setErrorMessage("Missing Organization ID");
            return;
        } 

        if(!contactSessionId){
            setScreen("error");
            setErrorMessage("Contact ID Missing");
            setTimeout(() => {
                setScreen("auth");
            }, 5000);
            return;
        }

        setIspending(true);
        try {
            const conversationId = await createConversation({
                contactSessionId,
                organizationId
            });
            setConversationId(conversationId)
            setScreen("chat");
        } catch {
            setScreen("auth");
        } finally{
            setIspending(false);
        }

        return;
    }
    return(
        <>
            <WidgetHeader>
                <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
                    <p className="text-3xl">Hi there! 👋🏼</p>
                    <p className="text-lg">Let&apos;s get you started</p>
                </div>
            </WidgetHeader>
            <div className="flex flex-1 flex-col gap-y-4 p-4 overflow-y-auto">
                <Button
                    className="h-16 w-full justify-between"
                    variant="outline"
                    onClick={handleNewConversation}
                    disabled={isPending}
                >
                    <div className="flex items-center gap-x-2">
                        <MessageSquareText className="size-4"/>
                        <span>Start Chat</span>
                    </div>
                    <ChevronRightIcon/>
                </Button>
                {hasVapiSecrets && widgetSettings?.vapiSetting?.assistantId && ( 
                    <Button
                        className="h-16 w-full justify-between"
                        variant="outline"
                        onClick={() => setScreen("voice")}
                        disabled={isPending}
                    >
                        <div className="flex items-center gap-x-2">
                            <MicIcon className="size-4"/>
                            <span>Start Voice Call</span>
                        </div>
                        <ChevronRightIcon/>
                    </Button>
                )}
                {hasVapiSecrets && widgetSettings?.vapiSetting?.phoneNumber && ( 
                    <Button
                        className="h-16 w-full justify-between"
                        variant="outline"
                        onClick={() => setScreen("contact")}
                        disabled={isPending}
                    >
                        <div className="flex items-center gap-x-2">
                            <PhoneCallIcon className="size-4"/>
                            <span>Contact Us</span>
                        </div>
                        <ChevronRightIcon/>
                    </Button>
                )}
            </div>
            <WidgetFooter/>
        </>
    );
} 