import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByList = query({
  args: { listName: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("todos")
      .withIndex("by_list", (q) => q.eq("listName", args.listName))
      .collect();
  },
});

export const getAllLists = query({
  args: {},
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
    const lists = new Set(todos.map((t) => t.listName));
    return Array.from(lists);
  },
});

export const add = mutation({
  args: {
    listName: v.string(),
    task: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("todos")
      .withIndex("by_list", (q) => q.eq("listName", args.listName))
      .collect();
    return await ctx.db.insert("todos", {
      ...args,
      completed: false,
      order: existing.length,
    });
  },
});

export const toggle = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) return;
    await ctx.db.patch(args.id, { completed: !todo.completed });
  },
});

export const remove = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
