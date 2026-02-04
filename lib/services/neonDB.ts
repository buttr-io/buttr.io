"use server"

import { Pool } from "@neondatabase/serverless";

// Create a single shared pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export async function query<T = any>(
  text: string,
  params: any[] = []
): Promise<T[]> {
  const client = await pool.connect();

  try {
    const result = await client.query(text, params);
    return result.rows;
  } finally {
    client.release();
  }
}
