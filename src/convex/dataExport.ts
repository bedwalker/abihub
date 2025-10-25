import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Export all data from current database
export const exportAllData = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const students = await ctx.db.query("students").collect();
    const comments = await ctx.db.query("comments").collect();
    const finances = await ctx.db.query("finances").collect();
    const announcements = await ctx.db.query("announcements").collect();
    const events = await ctx.db.query("events").collect();
    const todos = await ctx.db.query("todos").collect();
    const photos = await ctx.db.query("photos").collect();
    const settings = await ctx.db.query("settings").collect();

    const exportData = {
      exportDate: new Date().toISOString(),
      users: users.map(u => ({
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        description: u.description,
        image: u.image,
      })),
      students,
      comments,
      finances,
      announcements,
      events,
      todos,
      photos: photos.map(p => ({
        title: p.title,
        eventName: p.eventName,
        date: p.date,
        // Note: storageId cannot be migrated, images need to be re-uploaded
      })),
      settings,
    };

    console.log("=== DATA EXPORT ===");
    console.log(JSON.stringify(exportData, null, 2));
    console.log("===================");
    
    return exportData;
  },
});

// Import data to new database
export const importAllData = internalMutation({
  args: {
    data: v.object({
      users: v.array(v.any()),
      students: v.array(v.any()),
      comments: v.array(v.any()),
      finances: v.array(v.any()),
      announcements: v.array(v.any()),
      events: v.array(v.any()),
      todos: v.array(v.any()),
      settings: v.array(v.any()),
    }),
  },
  handler: async (ctx, args) => {
    // Import settings
    for (const setting of args.data.settings) {
      await ctx.db.insert("settings", {
        key: setting.key,
        value: setting.value,
      });
    }

    // Import students
    const studentIdMap = new Map();
    for (const student of args.data.students) {
      const newId = await ctx.db.insert("students", {
        name: student.name,
        image: student.image,
        phone: student.phone,
        email: student.email,
      });
      studentIdMap.set(student._id, newId);
    }

    // Import finances
    for (const finance of args.data.finances) {
      await ctx.db.insert("finances", {
        type: finance.type,
        amount: finance.amount,
        description: finance.description,
        date: finance.date,
      });
    }

    // Import announcements
    for (const announcement of args.data.announcements) {
      await ctx.db.insert("announcements", {
        title: announcement.title,
        text: announcement.text,
        author: announcement.author,
        timestamp: announcement.timestamp,
      });
    }

    // Import events
    for (const event of args.data.events) {
      await ctx.db.insert("events", {
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        category: event.category,
      });
    }

    // Import todos
    for (const todo of args.data.todos) {
      await ctx.db.insert("todos", {
        task: todo.task,
        completed: todo.completed,
        order: todo.order,
      });
    }

    // Import comments (with updated student IDs)
    for (const comment of args.data.comments) {
      const newStudentId = studentIdMap.get(comment.studentId);
      if (newStudentId) {
        await ctx.db.insert("comments", {
          studentId: newStudentId,
          authorName: comment.authorName,
          text: comment.text,
          timestamp: comment.timestamp,
        });
      }
    }

    console.log("✅ Data import completed successfully!");
    console.log("⚠️  Note: User accounts need to be recreated (sign up again)");
    console.log("⚠️  Note: Photos need to be re-uploaded (storage is project-specific)");
    
    return { success: true, message: "Data imported successfully" };
  },
});
