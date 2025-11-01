import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { users, sweets } from "@shared/schema";
import * as schema from "@shared/schema";

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

export { users, sweets };
