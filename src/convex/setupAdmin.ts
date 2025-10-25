import { internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";

export const makeFirstUserAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    
    if (users.length === 0) {
      console.log("No users found - waiting for first signup");
      return { success: false, message: "No users found. Please sign up first." };
    }

    const firstUser = users[0];
    
    if (firstUser.role === "admin") {
      console.log("First user is already an admin");
      return { success: true, message: "First user is already an admin" };
    }

    await ctx.db.patch(firstUser._id, { role: "admin" });
    console.log(`Made user ${firstUser.email || firstUser.name || firstUser._id} an admin`);
    return { success: true, message: `Made ${firstUser.email || firstUser.name || "user"} an admin` };
  },
});

export const makeUserAdminByEmail = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const user = users.find(u => u.email === args.email);
    
    if (!user) {
      throw new Error(`User with email ${args.email} not found`);
    }
    
    if (user.role === "admin") {
      return { success: true, message: "User is already an admin" };
    }
    
    await ctx.db.patch(user._id, { role: "admin" });
    return { success: true, message: `Made ${user.email} an admin` };
  },
});