import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";

export const create = mutation({
    args: {
        organizationId: v.string(),
        contactSessionId: v.id("contactSessions")
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.contactSessionId);

        if (!session || session.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHRIZED",
                message: "Invalid Session"
            })
        }
        
        const conversationId = await ctx.db.insert("conversations", {
            contactSessionId: session._id,
            status: "unresolved",
            organizationId: args.organizationId,
            threadId: "123" // TODO: Replace once functionality for thread creation is present
        })

        // ✅ FIX: Return the ID of the new conversation
        return conversationId;
    }
})

export const getOne = query({
    args: {
        conversationId: v.id("conversations"),
        contactSessionId: v.id("contactSessions")
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.contactSessionId);

        if (!session || session.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHRIZED",
                message: "Invalid Session"
            })
        }

        const conversation = await ctx.db.get(args.conversationId)
        
        if (!conversation) {
            return null;
        }

        return {
            _id: conversation._id,
            status: conversation.status,
            threadId: conversation.threadId
        };
    }
})