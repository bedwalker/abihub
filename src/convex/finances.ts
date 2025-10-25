import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
