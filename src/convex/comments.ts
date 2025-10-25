import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

export const listByStudent = query({
  args: { studentId: v.id("students") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .order("desc")
      .collect();
  },
});

export const add = mutation({
  args: {
    studentId: v.id("students"),
    authorName: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("You must be logged in to add comments");
    }
    return await ctx.db.insert("comments", {
      studentId: args.studentId,
      authorName: args.authorName,
      text: args.text,
      timestamp: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("comments") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Only admins can delete comments");
    }
    await ctx.db.delete(args.id);
  },
});

export const count = query({
  args: {},
  handler: async (ctx) => {
    const comments = await ctx.db.query("comments").collect();
    return comments.length;
  },
});