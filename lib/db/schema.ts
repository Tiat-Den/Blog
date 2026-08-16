import { pgTable, serial, text, integer, timestamp, varchar } from "drizzle-orm/pg-core";

// Page Views
export const views = pgTable("views", {
  slug: varchar("slug", { length: 255 }).primaryKey(),
  count: integer("count").default(0).notNull(),
});

// Guestbook
export const guestbook = pgTable("guestbook", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  body: text("body").notNull(),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Users (For later Auth integration)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  role: varchar("role", { length: 50 }).default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
