import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// define the users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
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
    .references(() => chirps.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// define relations for optimized queries via virtual properties
export const usersRelations = relations(users, ({ many }) => ({
  chirps: many(chirps),
  comments: many(comments),
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
