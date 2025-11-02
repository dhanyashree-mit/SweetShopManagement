import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";


export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
});
export const purchases = sqliteTable("purchases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sweetId: integer("sweet_id").notNull(),
  quantity: integer("quantity").notNull(),
  totalPrice: integer("total_price").notNull(),
  buyerName: text("buyer_name").notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const sweets = sqliteTable("sweets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: real("price").notNull(),
  quantity: integer("quantity").notNull().default(0),
});


export const stats = sqliteTable("stats", {
  id: integer("id").primaryKey(),
  total_revenue: real("total_revenue").default(0), // store total revenue here
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
