// "use client";

// import { getCountryFlagUrl, getCountryFromTimezone } from "@/lib/country-utils";
// import { api } from "@workspace/backend/_generated/api";
// import { Id } from "@workspace/backend/_generated/dataModel";
// import { Button } from "@workspace/ui/components/button";
// import { DicebearAvatar } from "@workspace/ui/components/dicebar-avatar";
// import { useQuery } from "convex/react";
// import { GlobeIcon, MailIcon, MonitorIcon } from "lucide-react";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { useMemo } from "react";
// import {
//     Accordion,
//     AccordionContent,
//     AccordionItem,
//     AccordionTrigger
// } from "@workspace/ui/components/accordion";
// import Bowser from "bowser";

// type InfoItem = {
//     label : string,
//     value : string | React.ReactNode,
//     className ?: string
// }

// type InfoSection = {
//     id : string,
//     icon : React.ComponentType<{clasname?: string}>,
//     title : string,
//     items : InfoItem[];
// }

// export const ContactPanel = () => {
//     const params = useParams();
//     const conversationId = params.conversationId as (Id<"conversations"> | null);

//     const contactSession = useQuery(api.private.contactSessions.getOneByConversationId,
//         conversationId ? {
//             conversationId
//         } : "skip"
//     );

//     const parseUserAgent = useMemo(() => {
//         return (userAgent?: string) => {
//             if (!userAgent) {
//                 return { browser: "Unknown", os: "Unknown", device: "Unknown" };
//             }

//             const browser = Bowser.getParser(userAgent);
//             const result = browser.getResult();

//             return {
//                 browser: result.browser.name || "Unknown",
//                 browserVersion: result.browser.version || "",
//                 os: result.os.name || "Unknown",
//                 osVersion: result.os.version || "",
//                 device: result.platform.type || "desktop",
//                 deviceVendor : result.platform.vendor || "",
//                 deviceModel : result.platform.model || ""
//             };
//         };
//     },[])

//     const userAgentInfo = useMemo(() =>{
//         return parseUserAgent(contactSession?.metadata?.userAgent)
//     },[contactSession?.metadata?.userAgent])
    
//     const countryInfo = useMemo(() => {
//         return getCountryFromTimezone(contactSession?.metadata?.timezone || undefined);
//     }, [contactSession?.metadata?.timezone]);
    
//     const accordianSections = useMemo<InfoSection[]>(() => {
//         if(!contactSession?.metadata){
//             return [];
//         }
//         return [
//             {
//                 id:"device-info",
//                 icon : MonitorIcon,
//                 title : "Device Information",
//                 items : [
//                     {
//                         label : "Browser",
//                         value: `${userAgentInfo.browser} ${userAgentInfo.browserVersion}`.trim()
//                     },
//                     {
//                         label : "OS",
//                         // FIX: Changed userAgentInfo.browser to userAgentInfo.os
//                         value: `${userAgentInfo.os} ${userAgentInfo.osVersion}`.trim()
//                     },
//                     {
//                         label: "Device",
//                         value: userAgentInfo.device.charAt(0).toUpperCase() + userAgentInfo.device.slice(1)
//                     }
//                 ]
//             },
//             {
//                 id: "location-info",
//                 icon: GlobeIcon,
//                 title: "Location Information",
//                 items: [
//                     {
//                         label: "Country",
//                         value: countryInfo?.name || "N/A"
//                     },
//                     {
//                         label: "IP Address",
//                         value: contactSession.metadata.ip || "N/A"
//                     }
//                 ]
//             }
//         ]
//     // FIX: Added the dependency array
//     },[contactSession, userAgentInfo, countryInfo]);

//     if(contactSession === undefined || contactSession === null)    return null;

//     return(
//         <div className="flex h-full w-full flex-col bg-background text-foreground">
//             <div className="flex flex-col gap-y-4 p-4">
//                 <div className="flex items-center gap-x-2">
//                     <DicebearAvatar
//                         badgeImageUrl={countryInfo?.code 
//                             ? getCountryFlagUrl(countryInfo.code)
//                             : undefined
//                         }
//                         seed={contactSession._id}
//                         size={42}
//                     />
//                     <div className="flex-1 overflow-hidden">
//                         <div className="flex items-center gap-x-2">
//                             <h4 className="line-clamp-1">
//                                 {contactSession.name}
//                             </h4>
//                         </div>
//                         <p className="line-clamp-1 text-muted-foreground text-sm">{contactSession.email}</p>
//                     </div>
//                 </div>
//                 <Button asChild className="w-full" size="lg">
//                     <Link href={`mailto:${contactSession.email}`}>
//                         <MailIcon/>
//                         <span>Send Email</span>
//                     </Link>
//                 </Button>
//             </div>
//             <div>
//                 {JSON.stringify(userAgentInfo, null ,2)}
//             </div>
//         </div>
        
//     )
// }

"use client";

import { getCountryFlagUrl, getCountryFromTimezone } from "@/lib/country-utils";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { DicebearAvatar } from "@workspace/ui/components/dicebar-avatar";
import { useQuery } from "convex/react";
// FIX 1: Import LucideProps for correct icon typing
import { MailIcon, MonitorIcon, GlobeIcon, LucideProps, ClockIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@workspace/ui/components/accordion";
import Bowser from "bowser";

type InfoItem = {
    label : string,
    value : string | React.ReactNode,
}

type InfoSection = {
    id : string,
    // FIX 1: Use the correct, more specific type for lucide-react icons
    icon : React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
    title : string,
    items : InfoItem[];
}

export const ContactPanel = () => {
    const params = useParams();
    const conversationId = params.conversationId as (Id<"conversations"> | null);

    const contactSession = useQuery(api.private.contactSessions.getOneByConversationId,
        conversationId ? {
            conversationId
        } : "skip"
    );

    const parseUserAgent = useMemo(() => {
        return (userAgent?: string) => {
            if (!userAgent) {
                return { browser: "N/A", os: "N/A", device: "N/A", browserVersion: "", osVersion: "" };
            }
            const browser = Bowser.getParser(userAgent);
            const result = browser.getResult();
            return {
                browser: result.browser.name || "Unknown",
                browserVersion: result.browser.version || "",
                os: result.os.name || "Unknown",
                osVersion: result.os.version || "",
                device: result.platform.type || "desktop",
            };
        };
    },[])

    const userAgentInfo = useMemo(() =>{
        return parseUserAgent(contactSession?.metadata?.userAgent)
    },[contactSession?.metadata?.userAgent, parseUserAgent]);
    
    const countryInfo = useMemo(() => {
        const timezone = contactSession?.metadata?.timezone;
        return timezone ? getCountryFromTimezone(timezone) : null;
    }, [contactSession?.metadata?.timezone]);
    
    const accordianSections = useMemo<InfoSection[]>(() => {
        if(!contactSession?.metadata){
            return [];
        }
        return [
            {
                id:"device-info",
                icon : MonitorIcon,
                title : "Device Information",
                items : [
                    {
                        label : "Browser",
                        value: `${userAgentInfo.browser} ${userAgentInfo.browserVersion}`.trim()
                    },
                    {
                        label : "OS",
                        value: `${userAgentInfo.os} ${userAgentInfo.osVersion}`.trim()
                    },
                    {
                        label: "Device",
                        value: userAgentInfo.device.charAt(0).toUpperCase() + userAgentInfo.device.slice(1)
                    },
                    {
                        label: "Screen",
                        value: contactSession.metadata.screenResolution
                    },
                    {
                        label: "ViewPort",
                        value: contactSession.metadata.viewportSize
                    },
                    {
                        label: "Cookies",
                        value: contactSession.metadata.cookiesEnabled ? "Enabled" : "Disabled"
                    },
                ]
            },
            {
                id: "location-info",
                icon: GlobeIcon,
                title: "Location & Language",
                items: [
                    ...(countryInfo
                        ? [
                            {
                                label : "Country",
                                value: (
                                    <span className="">
                                        {countryInfo.name}
                                    </span>
                                )
                            }
                        ]
                        : []
                    ),
                    {
                        label : "Language",
                        value : contactSession.metadata.language
                    },
                    {
                        label : "Timezone",
                        value : contactSession.metadata.timezone
                    },
                    {
                        label: "UTC Offset",
                        value: typeof contactSession.metadata.timezoneOffset === 'number'
                            ? `${contactSession.metadata.timezoneOffset / 60} hours`
                            : "N/A"
                    }
                ]
            },
            {
                id: "section-details",
                title : "Section Details",
                icon : ClockIcon,
                items: [
                    {
                        label: "Session Started",
                        value : new Date(
                            contactSession._creationTime
                        ).toLocaleString(),
                    }
                ]
            }
        ]
    },[contactSession, userAgentInfo, countryInfo]);

    if(contactSession === undefined || contactSession === null) return null;

    return(
        <div className="flex h-full w-full flex-col bg-background text-foreground">
            <div className="flex flex-col gap-y-4 p-4 border-b">
                <div className="flex items-center gap-x-2">
                    <DicebearAvatar
                        badgeImageUrl={countryInfo?.code 
                            ? getCountryFlagUrl(countryInfo.code)
                            : undefined
                        }
                        seed={contactSession._id}
                        size={42}
                    />
                    <div className="flex-1 overflow-hidden">
                        <h4 className="line-clamp-1 font-semibold">{contactSession.name}</h4>
                        <p className="line-clamp-1 text-muted-foreground text-sm">{contactSession.email}</p>
                    </div>
                </div>
                <Button asChild className="w-full" size="lg">
                    <Link href={`mailto:${contactSession.email}`} className="flex items-center gap-x-2">
                        <MailIcon size={18}/>
                        <span>Send Email</span>
                    </Link>
                </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
                <Accordion type="multiple" defaultValue={["device-info", "location-info"]}>
                    {accordianSections.map((section) => (
                        <AccordionItem value={section.id} key={section.id}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-x-2">
                                    <section.icon size={16} />
                                    <span className="text-sm font-medium">{section.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col gap-y-2 text-sm">
                                    {section.items.map((item) => (
                                        <div key={item.label} className="flex justify-between">
                                            <span className="text-muted-foreground">{item.label}</span>
                                            <span className="font-medium text-right">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    )
}