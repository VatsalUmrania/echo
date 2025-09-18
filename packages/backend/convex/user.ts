import { mutation, query } from "./_generated/server";

export const getMany = query({
    args : {},
    handler : async (ctx) => {
        const users = await ctx.db.query("users").collect();
        return users;
    }
})

export const add = mutation({
    args : {},
    handler : async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity) {
            throw new Error("Not authenticated");
        }
        const orgId = identity.orgId?.toString;
        if(!orgId){
            throw new Error("No organization found");
        }
        throw new Error("Error Testing")
        const UserID = await ctx.db.insert("users", { name : "New User" });
        return UserID;
    }

    
    
})