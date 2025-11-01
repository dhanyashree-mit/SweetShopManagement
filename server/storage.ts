import { type User, type InsertUser, type Sweet, type InsertSweet } from "@shared/schema";
import { db, users, sweets } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Sweet operations
  getSweet(id: number): Promise<Sweet | undefined>;
  getAllSweets(): Promise<Sweet[]>;
  createSweet(sweet: InsertSweet): Promise<Sweet>;
  updateSweet(id: number, sweet: Partial<InsertSweet>): Promise<Sweet | undefined>;
  deleteSweet(id: number): Promise<boolean>;
  
  // Inventory operations
  purchaseSweet(id: number, quantity: number): Promise<Sweet | undefined>;
  restockSweet(id: number, quantity: number): Promise<Sweet | undefined>;
  
  // Search operations
  searchSweets(params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Sweet[]>;
}

export class SQLiteStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Sweet operations
  async getSweet(id: number): Promise<Sweet | undefined> {
    const result = await db.select().from(sweets).where(eq(sweets.id, id));
    return result[0];
  }

  async getAllSweets(): Promise<Sweet[]> {
    return db.select().from(sweets);
  }

  async createSweet(sweet: InsertSweet): Promise<Sweet> {
    const result = await db.insert(sweets).values(sweet).returning();
    return result[0];
  }

  async updateSweet(id: number, sweet: Partial<InsertSweet>): Promise<Sweet | undefined> {
    const result = await db.update(sweets).set(sweet).where(eq(sweets.id, id)).returning();
    return result[0];
  }

  async deleteSweet(id: number): Promise<boolean> {
    const result = await db.delete(sweets).where(eq(sweets.id, id)).returning();
    return result.length > 0;
  }

  // Inventory operations
  async purchaseSweet(id: number, quantity: number): Promise<Sweet | undefined> {
    const sweet = await this.getSweet(id);
    if (!sweet || sweet.quantity < quantity) {
      return undefined;
    }
    
    const newQuantity = sweet.quantity - quantity;
    return this.updateSweet(id, { quantity: newQuantity });
  }

  async restockSweet(id: number, quantity: number): Promise<Sweet | undefined> {
    const sweet = await this.getSweet(id);
    if (!sweet) {
      return undefined;
    }
    
    const newQuantity = sweet.quantity + quantity;
    return this.updateSweet(id, { quantity: newQuantity });
  }

  // Search operations
  async searchSweets(params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Sweet[]> {
    let query = db.select().from(sweets);
    const allSweets = await query;
    
    return allSweets.filter(sweet => {
      if (params.name && !sweet.name.toLowerCase().includes(params.name.toLowerCase())) {
        return false;
      }
      if (params.category && sweet.category !== params.category) {
        return false;
      }
      if (params.minPrice !== undefined && sweet.price < params.minPrice) {
        return false;
      }
      if (params.maxPrice !== undefined && sweet.price > params.maxPrice) {
        return false;
      }
      return true;
    });
  }
}

export const storage = new SQLiteStorage();
