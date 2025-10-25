import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("finances").order("desc").collect();
  },
});

export const add = mutation({
  args: {
    type: v.union(v.literal("income"), v.literal("expense")),
    amount: v.number(),
    description: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("finances", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("finances"),
    type: v.union(v.literal("income"), v.literal("expense")),
    amount: v.number(),
    description: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Only admins can edit transactions");
    }
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("finances") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Only admins can delete transactions");
    }
    await ctx.db.delete(args.id);
  },
});

export const getBalance = query({
  args: {},
  handler: async (ctx) => {
    const transactions = await ctx.db.query("finances").collect();
    let balance = 0;
    for (const t of transactions) {
      if (t.type === "income") {
        balance += t.amount;
      } else {
        balance -= t.amount;
      }
    }
    return balance;
  },
});