import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { Pool as PgPool } from "pg";
import ws from "ws";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

let db;

if (process.env.NODE_ENV === 'production') {
  // Use standard PostgreSQL driver for production (Docker)
  const pool = new PgPool({ 
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  db = drizzlePg(pool);
} else {
  // Use Neon serverless driver for development (Replit)
  neonConfig.webSocketConstructor = ws;
  const pool = new NeonPool({ 
    connectionString: process.env.DATABASE_URL
  });
  db = drizzleNeon(pool);
}

export { db };
