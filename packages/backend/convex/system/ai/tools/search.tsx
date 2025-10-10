import { google } from "@ai-sdk/google";
import { createTool } from "@convex-dev/agent";
import { generateText } from "ai";
import z from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";
import rag from "../rag";
import { query } from "../../../_generated/server";
import { SEARCH_INTERPRETER_PROMPT } from "../constants";

export const search = createTool({
    description: "Search the Knowledge Base for relevant information to answer user questions.",
    args: z.object({
        query: z
            .string()
            .describe("The Search Query to find relevant information")
    }),
    handler: async(ctx, args) =>{
        if(!ctx.threadId){
            return "Missing Thread Id";
        }

        const conversation = await ctx.runQuery(
            internal.system.conversations.getByThreadId,
            {
                threadId: ctx.threadId
            },
        )

        if(!conversation){
            return "Conversation Not Found"
        };

        const orgId = conversation.organizationId;

        const searchResult = await rag.search(ctx, {
            namespace: orgId,
            query : args.query,
            limit: 5
        });

        const contextText = `Found results in ${searchResult.entries
            .map((e) => e.title || null)
            .filter((t) => t !== null)
            .join(", ")}. Here is the context:\n\n${searchResult.text}`;

        const response = await generateText({
            messages: [
                {
                role: "system",
                content: SEARCH_INTERPRETER_PROMPT,
                },
                {
                role: "user",
                content: `User asked: "${args.query}"\n\nSearch results: ${contextText}`
                }
            ],
            model: google.chat("gemini-2.0-flash"),
         });

        await supportAgent.saveMessage(ctx, {
            threadId : ctx.threadId,
            message: {
                role : "assistant",
                content : response.text,
            }
        });

        return response.text;

    },
});