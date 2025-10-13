"use client";

import { api } from "@workspace/backend/_generated/api"
import { useQuery } from "convex/react"
import { Loader2Icon } from "lucide-react"
import { CustomizationForm } from "../components/customization-form"

export const CustomizationView = () => {
    const widgetSetiings = useQuery(api.private.widgetSetting.getOne)
    const vapiPlugin = useQuery(api.private.plugins.getOne, { service : "vapi"})
    const isLoading = widgetSetiings === undefined || vapiPlugin === undefined;
    
    if(isLoading){
        return(
            <div className="fixed inset-0 flex flex-col items-center justify-center gap-y-2 bg-muted">
                <Loader2Icon className="text-muted-foreground animate-spin"/>
                <p className="text-muted-foreground text-sm">Loading..</p>
            </div>
        )
    }
    
    return(
        <div className="fixed inset-0 flex flex-col bg-muted overflow-y-auto overflow-x-hidden">
            <div className="flex-1 p-8">
                <div className="max-w-screen-md mx-auto w-full">
                    <div className="space-y-2">
                        <h1 className="text-2xl md:text-4xl">Widget Customization</h1>
                        <p className="text-muted-foreground">
                            Customize how your chat widget looks and behaaves for your customers
                        </p>
                    </div>
                    <div className="mt-8 pb-8">
                        <CustomizationForm
                            intialData={widgetSetiings}
                            hasVapiPlugin={!!vapiPlugin}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}