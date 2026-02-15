import { NextRequest, NextResponse } from "next/server";

export function redirectToLogin(req: NextRequest, clearSession = false) {
  const loginUrl = new URL("/login", req.url);

  const res = NextResponse.redirect(loginUrl);

  if (clearSession) {
    res.cookies.set({
      name: "session",
      value: "",
      path: "/",
      expires: new Date(0), // delete cookie
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
  }

  return res;
}