import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("announcements").order("desc").collect();
  },
});

export const recent = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db.query("announcements").order("desc").take(args.limit);
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    text: v.string(),
    author: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("announcements", {
      ...args,
      timestamp: Date.now(),
    });
  },
});
