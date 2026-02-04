import { NextRequest, NextResponse } from "next/server";
import jwt, { TokenExpiredError } from "jsonwebtoken";

export const runtime = "nodejs";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/api/login"
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes (no auth)
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;

  if (!token) {
    return redirectToLogin(req);
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_PUBLIC_KEY!,
      { algorithms: ["RS256"] }
    ) as { sub: string };

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.sub);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });

  } catch (err) {
    if (err instanceof TokenExpiredError) {
      // Expected case — user session expired
      return redirectToLogin(req, true);
    }

    // Unexpected JWT error
    console.error("JWT verification failed:", err);
    return redirectToLogin(req, true);
  }
}

function redirectToLogin(req: NextRequest, clearSession = false) {
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

export const config = {
  matcher: [
    // Run middleware on everything EXCEPT:
    // - _next static files
    // - images
    // - favicon
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};