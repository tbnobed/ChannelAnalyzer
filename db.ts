import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Configure for Neon serverless (Replit environment)
// In production with regular PostgreSQL, the connection still works
// but doesn't use WebSocket features
if (process.env.NODE_ENV !== 'production') {
  neonConfig.webSocketConstructor = ws;
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL
});

export const db = drizzle(pool);
