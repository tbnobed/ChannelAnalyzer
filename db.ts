import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import ws from "ws";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // @ts-ignore - ws types are compatible
  webSocketConstructor: ws
});

export const db = drizzle(pool);
