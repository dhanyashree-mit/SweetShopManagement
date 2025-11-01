import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { users, sweets } from "@shared/schema";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite, { schema });

// Create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_admin INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS sweets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0
  );
`);

// Seed initial data if database is empty
async function seedDatabase() {
  try {
    const existingSweets = await db.select().from(sweets);
    
    if (existingSweets.length === 0) {
      console.log('Seeding database with initial sweets...');
      
      const seedSweets = [
        { name: 'Chocolate Truffles', category: 'Chocolate', price: 12.99, quantity: 45 },
        { name: 'Gummy Bears', category: 'Gummies', price: 5.99, quantity: 120 },
        { name: 'Rainbow Lollipops', category: 'Lollipops', price: 3.99, quantity: 8 },
        { name: 'Caramel Delights', category: 'Caramels', price: 8.99, quantity: 0 },
        { name: 'Fruit Hard Candies', category: 'Hard Candy', price: 6.49, quantity: 85 },
        { name: 'Chocolate Almonds', category: 'Chocolate', price: 15.99, quantity: 32 },
      ];

      for (const sweet of seedSweets) {
        await db.insert(sweets).values(sweet);
      }
      
      console.log('Database seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run seed function
seedDatabase();

export { users, sweets };
