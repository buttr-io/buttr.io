"use server";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { query } from "@/lib/services/neonDB";


// Create new users
export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = crypto.randomUUID();

  await query(
    `
    INSERT INTO users (id, email, password_hash)
    VALUES ($1, $2, $3)
    `,
    [userId, email, passwordHash]
  );

  return NextResponse.json({ user_id: userId });
}
