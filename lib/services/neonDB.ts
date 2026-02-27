"use server"

import { Pool } from "@neondatabase/serverless";
import { headers } from "next/headers";

// Create a single shared pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export async function query<T = any>(
  text: string,
  params: any[] = []
): Promise<T[]> {
  const client = await pool.connect();

  const userId = (await headers()).get("x-user-id");
  if(userId){
    // await query(`SET LOCAL app.current_user_id = $1`, [userId]);
  }

  try {
    const result = await client.query(text, params);
    return result.rows;
  } finally {
    client.release();
  }
}
