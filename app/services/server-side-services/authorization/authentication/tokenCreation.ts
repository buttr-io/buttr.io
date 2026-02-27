"use server";

import jwt from "jsonwebtoken";
import crypto from "crypto";
import { serialize } from "cookie";

export const runtime = "nodejs";

export function createSessionToken(userId: string) {
  return jwt.sign(
    {
      sub: userId,
      session_id: crypto.randomUUID(),
    },
    process.env.JWT_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    {
      algorithm: "RS256",
      issuer: "buttr-auth",
      expiresIn: "1h",
    }
  );
}


export function setSessionCookie(res: Response, token: string) {
  res.headers.append(
    "Set-Cookie",
    serialize("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      domain: ".buttr.io",
      path: "/",
    })
  );
}
