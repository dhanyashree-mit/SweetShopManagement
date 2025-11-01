import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
});

export const sweets = sqliteTable("sweets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: real("price").notNull(),
  quantity: integer("quantity").notNull().default(0),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertSweetSchema = createInsertSchema(sweets).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSweet = z.infer<typeof insertSweetSchema>;
export type Sweet = typeof sweets.$inferSelect;
