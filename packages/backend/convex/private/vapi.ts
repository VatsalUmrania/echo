import { Vapi, VapiClient} from "@vapi-ai/server-sdk";
import { internal } from "../_generated/api";
import { action } from "../_generated/server";
import { getSecretValue, parseSecretString } from "../lib/secrets";
import { ConvexError } from "convex/values";

export const getAssistants = action({
    args:{ },
    handler: async(ctx) => {
        const identity = await ctx.auth.getUserIdentity();
                            
        if (identity === null) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Identity Not Found",
            });
        }
        
        const orgId = identity.orgId as string;

        if (!orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization Not Found",
            });
        }

        const plugin = await ctx.runQuery(
            internal.system.plugins.getByOrganizationIdandService,
            {
                organizationId: orgId,
                service: "vapi"
            }
        );

        if(!plugin){
            throw new ConvexError({
                code : "NOT_FOUND",
                message : "Plugin Not Found"
            })
        }

        const secretName = plugin.secretName;
        const secretValue = await getSecretValue(secretName);
        const secretData = parseSecretString<{
            privateApiKey: string,
            publicApiKey : string
        }>(secretValue);

        if(!secretData){
            throw new ConvexError({
                code : "NOT_FOUND",
                message : "Credentials Not Found"
            })
        }

        if(!secretData.privateApiKey || !secretData.publicApiKey){
            const missingKeys = [];
            if (!secretData.privateApiKey) missingKeys.push("Private API Key");
            if (!secretData.publicApiKey) missingKeys.push("Public API Key");

            throw new ConvexError({
                code: "NOT_FOUND",
                message: `${missingKeys.join(" and ")} missing. Please reconnect your Vapi Account`
            });
        }

        const vapiClient = new VapiClient({
            token : secretData.privateApiKey,
        })

        const assistants = await vapiClient.assistants.list();

        return assistants;
    }
});

export const getPhoneNumbers = action({
    args:{ },
    handler: async(ctx) => {
        const identity = await ctx.auth.getUserIdentity();
                            
        if (identity === null) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Identity Not Found",
            });
        }
        
        const orgId = identity.orgId as string;

        if (!orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization Not Found",
            });
        }

        const plugin = await ctx.runQuery(
            internal.system.plugins.getByOrganizationIdandService,
            {
                organizationId: orgId,
                service: "vapi"
            }
        );

        if(!plugin){
            throw new ConvexError({
                code : "NOT_FOUND",
                message : "Plugin Not Found"
            })
        }

        const secretName = plugin.secretName;
        const secretValue = await getSecretValue(secretName);
        const secretData = parseSecretString<{
            privateApiKey: string,
            publicApiKey : string
        }>(secretValue);

        if(!secretData){
            throw new ConvexError({
                code : "NOT_FOUND",
                message : "Credentials Not Found"
            })
        }

        if(!secretData.privateApiKey || !secretData.publicApiKey){
            const missingKeys = [];
            if (!secretData.privateApiKey) missingKeys.push("Private API Key");
            if (!secretData.publicApiKey) missingKeys.push("Public API Key");

            throw new ConvexError({
                code: "NOT_FOUND",
                message: `${missingKeys.join(" and ")} missing. Please reconnect your Vapi Account`
            });
        }

        const vapiClient = new VapiClient({
            token : secretData.privateApiKey,
        })

        const phoneNumbers = await vapiClient.phoneNumbers.list();

        return phoneNumbers;
    }
});

