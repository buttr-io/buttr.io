"use server";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { query } from "@/lib/services/neonDB";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const result = await query(
    `SELECT id, password_hash FROM users WHERE email=$1 AND deleted_at IS NULL;`,
    [email]
  );

  if (result.length === 0) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const user = result[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign(
    { sub: user.id },
    process.env.JWT_PRIVATE_KEY!,
    { 
      algorithm: "RS256",
      expiresIn: "1h" }
  );

  const res = NextResponse.json({ success: true });

  res.headers.set(
    "Set-Cookie",
    serialize("session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    })
  );

  return res;
}
