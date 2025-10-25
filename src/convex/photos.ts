import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const photos = await ctx.db.query("photos").collect();
    return await Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        url: await ctx.storage.getUrl(photo.storageId),
      }))
    );
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
    storageId: v.id("_storage"),
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