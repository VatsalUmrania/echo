"use client";

import {
    type LucideIcon,
    BookOpenIcon,
    BotIcon,
    GemIcon,
    MicIcon,
    PaletteIcon,
    PhoneIcon,
    UserIcon,
    UsersIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@workspace/ui/components/card";


interface Feature {
    icon : LucideIcon,
    label : string,
    description : string,
};

interface PremiumFeatureOverLayProps {
    children : React.ReactNode;
};

const features: Feature[] = [
    {
        icon: BotIcon,
        label: "AI Customer Support",
        description: "Intelligent Automated Responses 24/7"
    },
    {
        icon: MicIcon,
        label: "AI Voice Agent",
        description: "Natural Voice Conversaations with Customers"
    },
     {
        icon: PhoneIcon,
        label: "Phone System",
        description: "Inbound & Outbound Calling Capabilities"
    },
    {
        icon: BookOpenIcon,
        label: "Knowledge Base",
        description: "Train AAI on your Documentations"
    },
    {
        icon: UserIcon,
        label: "Team Access",
        description: "Up to 5 Operators per Organizations"
    },
    {
        icon: PaletteIcon,
        label: "Widget Customization",
        description: "Customize your chat widget apperance"
    }
];

export const PremiumFeatureOverLay = ({
    children
} : PremiumFeatureOverLayProps) => {
    const router = useRouter();

    return(
        <div className="relative min-h-screen">
            {/*Blurred Background Content*/}
            <div className="pointer-events-none select-none blur-[2px]">
                {children}
            </div>

            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"/>

            <div className="absolute inset-0 z-40 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center">
                            <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full border bg-muted">
                                <GemIcon className="size-6 text-muted-foreground"/>
                            </div>
                        </div>
                        <CardTitle className="text-xl">Premium Feature</CardTitle>
                        <CardDescription>
                            This Feature Requires a Pro Subsription
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Features List */}
                        <div className="space-y-6">
                            {features.map((feature) => (
                                <div key={feature.label} className="flex items-center gap-3">
                                    <div className="flex size-8 items-center justify-center rounded-lg border bg-muted">
                                        <feature.icon className="size-4 text-muted-foreground"/>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-sm">{feature.label}</p>
                                        <p className="text-muted-foreground text-xs">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            className="w-full"
                            onClick={() => router.push("/billing")}
                            size="lg"
                        >
                            View Plans
                        </Button>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
} 