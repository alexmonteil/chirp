import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// define the users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  isEmailVerified: boolean("is_email_verified").default(false).notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// define credentials table
export const credentials = pgTable("credentials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  passwordHash: text("password_hash").notNull(),
  failedLoginAttempts: integer("failed_login_attempts").default(0).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  verifyToken: text("verify_token").unique(),
  verifyTokenExpiration: timestamp("verify_token_expiration"),
});

// define the chirps table
export const chirps = pgTable("chirps", {
  id: serial("id").primaryKey(),
  body: text("body").notNull(),
  authorId: integer("author_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// define the comments table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  body: text("body").notNull(),
  authorId: integer("author_id")
    .references(() => users.id)
    .notNull(),
  chirpId: integer("chirp_id")
    .references(() => chirps.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// define relations for optimized queries via virtual properties
export const usersRelations = relations(users, ({ one, many }) => ({
  chirps: many(chirps),
  comments: many(comments),
  credentials: one(credentials, {
    fields: [users.id],
    references: [credentials.id],
  }),
}));

export const credentialsRelations = relations(credentials, ({ one }) => ({
  user: one(users, {
    fields: [credentials.userId],
    references: [users.id],
  }),
}));

export const chirpsRelations = relations(chirps, ({ one, many }) => ({
  author: one(users, {
    fields: [chirps.authorId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  chirp: one(chirps, {
    fields: [comments.chirpId],
    references: [chirps.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
}));
