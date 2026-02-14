"use server";

import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true, message: "User logged out successfully" });

  // Clear session cookie
  res.cookies.set({
    name: "session",
    value: "",
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  return res;
}
