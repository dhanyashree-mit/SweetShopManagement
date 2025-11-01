import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  hashPassword, 
  comparePassword, 
  generateToken,
  authenticateToken,
  requireAdmin,
  type AuthRequest 
} from "./auth";
import { insertUserSchema, insertSweetSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth endpoints
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, isAdmin } = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        isAdmin: isAdmin || false,
      });

      // Generate token
      const token = generateToken({
        userId: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      });

      res.status(201).json({
        token,
        user: {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const valid = await comparePassword(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Get current user info
  app.get("/api/auth/me", authenticateToken, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Sweet endpoints (all protected)
  app.get("/api/sweets", authenticateToken, async (req, res) => {
    try {
      const sweets = await storage.getAllSweets();
      res.json(sweets);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/sweets/search", authenticateToken, async (req, res) => {
    try {
      const { name, category, minPrice, maxPrice } = req.query;
      
      const sweets = await storage.searchSweets({
        name: name as string | undefined,
        category: category as string | undefined,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      });
      
      res.json(sweets);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/sweets/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const sweet = await storage.getSweet(id);
      
      if (!sweet) {
        return res.status(404).json({ message: "Sweet not found" });
      }
      
      res.json(sweet);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/sweets", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const sweetData = insertSweetSchema.parse(req.body);
      const sweet = await storage.createSweet(sweetData);
      res.status(201).json(sweet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/sweets/:id", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const sweetData = insertSweetSchema.partial().parse(req.body);
      
      const sweet = await storage.updateSweet(id, sweetData);
      if (!sweet) {
        return res.status(404).json({ message: "Sweet not found" });
      }
      
      res.json(sweet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/sweets/:id", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSweet(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Sweet not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Inventory endpoints
  app.post("/api/sweets/:id/purchase", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Valid quantity required" });
      }

      const sweet = await storage.purchaseSweet(id, quantity);
      if (!sweet) {
        return res.status(400).json({ message: "Insufficient stock or sweet not found" });
      }

      res.json(sweet);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/sweets/:id/restock", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Valid quantity required" });
      }

      const sweet = await storage.restockSweet(id, quantity);
      if (!sweet) {
        return res.status(404).json({ message: "Sweet not found" });
      }

      res.json(sweet);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
