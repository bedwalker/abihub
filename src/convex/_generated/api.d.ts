/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as announcements from "../announcements.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth from "../auth.js";
import type * as comments from "../comments.js";
import type * as events from "../events.js";
import type * as finances from "../finances.js";
import type * as http from "../http.js";
import type * as photos from "../photos.js";
import type * as seedData from "../seedData.js";
import type * as settings from "../settings.js";
import type * as students from "../students.js";
import type * as todos from "../todos.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  announcements: typeof announcements;
  "auth/emailOtp": typeof auth_emailOtp;
  auth: typeof auth;
  comments: typeof comments;
  events: typeof events;
  finances: typeof finances;
  http: typeof http;
  photos: typeof photos;
  seedData: typeof seedData;
  settings: typeof settings;
  students: typeof students;
  todos: typeof todos;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
