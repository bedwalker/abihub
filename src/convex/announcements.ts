import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

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

export const update = mutation({
  args: {
    id: v.id("announcements"),
    title: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Only admins can edit announcements");
    }
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Only admins can delete announcements");
    }
    await ctx.db.delete(args.id);
  },
});