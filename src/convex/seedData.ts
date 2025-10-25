import { internalMutation } from "./_generated/server";

export const clearAllData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Delete all students
    const students = await ctx.db.query("students").collect();
    for (const student of students) {
      await ctx.db.delete(student._id);
    }

    // Delete all comments
    const comments = await ctx.db.query("comments").collect();
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // Delete all finances
    const finances = await ctx.db.query("finances").collect();
    for (const finance of finances) {
      await ctx.db.delete(finance._id);
    }

    // Delete all announcements
    const announcements = await ctx.db.query("announcements").collect();
    for (const announcement of announcements) {
      await ctx.db.delete(announcement._id);
    }

    // Delete all events
    const events = await ctx.db.query("events").collect();
    for (const event of events) {
      await ctx.db.delete(event._id);
    }

    // Delete all todos
    const todos = await ctx.db.query("todos").collect();
    for (const todo of todos) {
      await ctx.db.delete(todo._id);
    }

    // Delete all photos
    const photos = await ctx.db.query("photos").collect();
    for (const photo of photos) {
      await ctx.db.delete(photo._id);
    }

    // Keep settings (abiDate and targetAmount)
    
    console.log("All demo data cleared successfully!");
  },
});

// Keep the original seed function for reference but don't use it
export const seedDatabase = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("Seeding is disabled. Use clearAllData to remove demo data.");
  },
});