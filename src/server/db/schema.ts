import { boolean, pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export enum MessageRole {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
}

export const messageRoleEnum = pgEnum("role", [
  MessageRole.SYSTEM,
  MessageRole.USER,
  MessageRole.ASSISTANT,
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @_PURE_ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @_PURE_ */ new Date())
    .notNull(),
  twoFactorEnabled: boolean("two_factor_enabled")
    .$defaultFn(() => false)
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => /* @_PURE_ */ new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => /* @_PURE_ */ new Date()),
});

export const courses = pgTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").$defaultFn(() => /* @_PURE_ */ new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => /* @_PURE_ */ new Date()),
  brainrot: text("brainrot_id")
    .notNull()
    .references(() => brainrot.id, { onDelete: "cascade" }),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const objectives = pgTable("objectives", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => /* @_PURE_ */ new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => /* @_PURE_ */ new Date()),
  course_id: text("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
});

export const files = pgTable("files", {
  id: text("id").primaryKey(),
  course_id: text("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  file_url: text("file_url").notNull(),
});

export const chats = pgTable("chats", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  active: boolean("active")
    .$defaultFn(() => false)
    .notNull(),
  completedObjectives: text("completed_objectives")
    .notNull()
    .references(() => objectives.id, { onDelete: "cascade" }),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  chat_id: text("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  role: messageRoleEnum("role").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const brainrot = pgTable("brainrot", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  personalityPrompt: text("personality_prompt").notNull(),
})

export const twoFactor = pgTable("two_factor", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  secret: text("secret").notNull(),
  backupCodes: text("backup_codes").notNull(),
});

export type Chat = typeof chats.$inferSelect;
export type Message = typeof messages.$inferSelect;
