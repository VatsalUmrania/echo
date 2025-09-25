"use client"

import { useAtomValue, useSetAtom } from "jotai";
import { LoaderIcon } from "lucide-react";
import { contactSessionIdAtomFamily, errorMessageAtom, loadingMessageAtom, organizationIdAtom, screenAtom } from "@/modules/widget/atoms/widget-atoms";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { useEffect, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";

type InitStep = "storage" | "org" | "session" | "settings" | "vapi" | "done";


export const WidgetLoadingScreen = ({ organizationId }:{organizationId : string | null }) => {
    const [step , setStep] = useState<InitStep>("org");
    const [sesseionValid , setSessionValid] = useState(false);
    const setLoadingMessage = useSetAtom(loadingMessageAtom)
    const loadingMessage = useAtomValue(loadingMessageAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setScreen = useSetAtom(screenAtom);
    const setOrganizationId = useSetAtom(organizationIdAtom);

    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId ?? ""))
    const validateOrganization = useAction(api.public.organizations.validate);
    // Step 1 : Organization Setup
    useEffect(() => {
        if (step !== "org"){
            return;
        }

        setLoadingMessage("Finding Organization Id...");

        if(!organizationId){
            setErrorMessage("Organization Id is required");
            setScreen("error");
            return;
        }

        setLoadingMessage("Verifying Organization...");
        validateOrganization({ organizationId })
            .then((result) => {
                if(result.valid){
                    setOrganizationId(organizationId);
                    setStep("session");
                }else{
                    setErrorMessage(result.reason || "Invalid Configuration");
                    setScreen("error");
                }
            }).catch(() => {
                setErrorMessage("Unable to Verify Organization");
                setScreen("error");
            })
    }, [
        step , 
        organizationId, 
        setErrorMessage, 
        setScreen,
        setOrganizationId,
        setStep,
        validateOrganization,
        setLoadingMessage
    ]);

    // Step 2 : Validate Session (if Exists)
    const validateContactSession = useMutation(api.public.contactSession.validate);
    useEffect(() =>{
        if (step !== "session"){
            return;
        }

        setLoadingMessage("Finding Contact Session ID...");

        if (!contactSessionId){
            setSessionValid(false);
            setStep("done");
            return;
        }

        setLoadingMessage("Validating Session...");

        validateContactSession({
            contactSessionId: contactSessionId
        })
        .then((result) => {
            setSessionValid(result.valid);
            setStep("done");
        })
        .catch(() =>{
            setSessionValid(false);
            setStep("settings");
        })
    },[
        step,
        contactSessionId,
        validateContactSession,
        setLoadingMessage
    ])

    useEffect(()=>{
        if(step !== "done"){
            return;
        }

        const hasValidSession = contactSessionId && sesseionValid;
        setScreen(hasValidSession ? "selection" : "auth");

    },[
        step,
        contactSessionId,
        sesseionValid,
        setScreen
    ])

    return(
        <>
            <WidgetHeader>
                <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
                    <p className="text-3xl">Hi there! 👋🏼</p>
                    <p className="text-lg">Let&apos;s get you started</p>
                </div>
            </WidgetHeader>
            <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4">
                <LoaderIcon className="animate-spin"/>
                <p className="text-sm">
                    {loadingMessage || "Loading.."}
                </p>
            </div>
        </>
    );
} 