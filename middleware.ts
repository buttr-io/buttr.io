import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { redirectToLogin } from "./lib/server-redirections";

export const runtime = "nodejs";

const DASHBOARD_PUBLIC_PATHS = ["/login", "/api/logout", "/api/login", "/api/auth/google", "/api/auth/google/callback"];

const inDevMode = process.env.DEV === "true";

export function middleware(req: NextRequest) {

  const host = req.headers.get("host")!;
  const { pathname } = req.nextUrl;

  const isRootDomain =
    host === "buttr.io" ||
    (inDevMode && host === "lvh.me:3000") ||
    (inDevMode && host === "localhost:3000");

  const isDashboardDomain =
    host === "dashboard.buttr.io" ||
    (inDevMode && host === "dashboard.lvh.me:3000") ||
    (inDevMode && host === "dashboard.localhost:3000");

  /*
   * 1️⃣ ROOT DOMAIN (Marketing)
   */
  if (isRootDomain) {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/home", req.url));
    }

    return NextResponse.next();
  }

  /*
   * 2️⃣ DASHBOARD DOMAIN
   */
  if (isDashboardDomain) {

    let rewrittenUrl: URL | null = null;

    if (pathname === "/") {
      rewrittenUrl = new URL("/dashboard", req.url);
    }

    
    const token = req.cookies.get("session")?.value;
    
    if (DASHBOARD_PUBLIC_PATHS.includes(pathname)) {
      // If already logged in and visiting /login → redirect to root
      if (token && pathname === "/login") {
        try {
          jwt.verify(
            token,
            process.env.JWT_PUBLIC_KEY!.replace(/\\n/g, "\n"),
            { algorithms: ["RS256"] }
          );
          return NextResponse.redirect(new URL("/", req.url));
        } catch {
          // invalid token → allow login
        }
      }

      return NextResponse.next();
   }

    if (!token) {
      return redirectToLogin(req);
    }

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_PUBLIC_KEY!.replace(/\\n/g, "\n"),
        { algorithms: ["RS256"] }
      ) as { sub: string; exp: number };

      const headers = new Headers(req.headers);
      headers.set("x-user-id", payload.sub);

      const response = rewrittenUrl
        ? NextResponse.rewrite(rewrittenUrl, {
            request: { headers },
          })
        : NextResponse.next({
            request: { headers },
          });

      // Sliding session logic
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = payload.exp - now;

      if (timeLeft < 15 * 60) {
        const newToken = jwt.sign(
          { sub: payload.sub },
          process.env.JWT_PRIVATE_KEY!.replace(/\\n/g, "\n"),
          { algorithm: "RS256", expiresIn: "72h" }
        );

        response.cookies.set("session", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
      }

      return response;

    } catch {
      return redirectToLogin(req, true);
    }
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run middleware on everything EXCEPT:
    // - _next static files
    // - images
    // - favicon
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}