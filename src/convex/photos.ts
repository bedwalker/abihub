import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("photos").collect();
  },
});

export const listByEvent = query({
  args: { eventName: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("photos")
      .withIndex("by_event", (q) => q.eq("eventName", args.eventName))
      .collect();
  },
});

export const add = mutation({
  args: {
    url: v.string(),
    title: v.string(),
    eventName: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    // Anyone can upload photos
    return await ctx.db.insert("photos", args);
  },
});

export const remove = mutation({
  args: { id: v.id("photos") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Only admins can delete photos");
    }
    await ctx.db.delete(args.id);
  },
});