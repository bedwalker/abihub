import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    students: defineTable({
      name: v.string(),
      image: v.string(),
      phone: v.optional(v.string()),
      email: v.optional(v.string()),
    }),

    comments: defineTable({
      studentId: v.id("students"),
      authorName: v.string(),
      text: v.string(),
      timestamp: v.number(),
    }).index("by_student", ["studentId"]),

    finances: defineTable({
      type: v.union(v.literal("income"), v.literal("expense")),
      amount: v.number(),
      description: v.string(),
      date: v.string(),
    }),

    announcements: defineTable({
      title: v.string(),
      text: v.string(),
      author: v.string(),
      timestamp: v.number(),
    }),

    events: defineTable({
      title: v.string(),
      description: v.string(),
      date: v.string(),
      time: v.string(),
      location: v.string(),
      category: v.string(),
    }),

    todos: defineTable({
      listName: v.string(),
      task: v.string(),
      completed: v.boolean(),
      order: v.number(),
    }).index("by_list", ["listName"]),

    photos: defineTable({
      url: v.string(),
      title: v.string(),
      eventName: v.string(),
      date: v.string(),
    }).index("by_event", ["eventName"]),

    settings: defineTable({
      key: v.string(),
      value: v.string(),
    }).index("by_key", ["key"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;