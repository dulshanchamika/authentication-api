import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config(); // Fallback to local .env if running from backend dir

let db;
let sql;

if (process.env.NODE_ENV === 'development') {
  // In development (Docker), use standard postgres driver to connect
  // directly to the neon_local PgBouncer on port 5432
  const postgres = (await import('postgres')).default;
  const { drizzle } = await import('drizzle-orm/postgres-js');

  sql = postgres(process.env.DATABASE_URL, { ssl: false });
  db = drizzle(sql);
} else {
  // In production, use the neon serverless HTTP driver
  const { neon } = await import('@neondatabase/serverless');
  const { drizzle } = await import('drizzle-orm/neon-http');

  sql = neon(process.env.DATABASE_URL);
  db = drizzle(sql);
}

export { db, sql };
