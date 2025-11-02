import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db } from "./db"; // ✅ fixed path (it’s inside 'server/db.ts')
import { sql } from "drizzle-orm"; // ✅ needed for executing raw SQL if required

const app = express();

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});


// ✅ ADD PURCHASE ROUTE (updates total revenue in stats table)
app.post("/api/purchase", async (req: Request, res: Response) => {
  try {
    const { price } = req.body;

    if (!price || isNaN(price)) {
      return res.status(400).json({ success: false, message: "Invalid price" });
    }

    // Check if a stats row exists
    const existing = await db.execute(sql`SELECT * FROM stats LIMIT 1`);

    if ((existing as any).rows.length === 0) {
      // If no stats row, insert a new one
      await db.execute(sql`INSERT INTO stats (total_revenue) VALUES (${price})`);
    } else {
      // Otherwise, update the existing total
      await db.execute(
        sql`UPDATE stats SET total_revenue = total_revenue + ${price}`
      );
    }

    res.json({ success: true, message: "Revenue updated successfully!" });
  } catch (error) {
    console.error("Purchase error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ✅ Start the server
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "127.0.0.1", () => {
    log(`✅ Server running at http://127.0.0.1:${port}`);
  });
})();
