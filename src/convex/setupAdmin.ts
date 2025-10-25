import { internalMutation } from "./_generated/server";

export const makeFirstUserAdmin = internalMutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    
    if (users.length === 0) {
      console.log("No users found");
      return;
    }

    const firstUser = users[0];
    
    if (firstUser.role === "admin") {
      console.log("First user is already an admin");
      return;
    }

    await ctx.db.patch(firstUser._id, { role: "admin" });
    console.log(`Made user ${firstUser.email || firstUser.name || firstUser._id} an admin`);
  },
});
