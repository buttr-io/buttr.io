import { NextRequest, NextResponse } from "next/server";
import jwt, { TokenExpiredError } from "jsonwebtoken";

export const runtime = "nodejs";

const DASHBOARD_PUBLIC_PATHS = ["/login", "/api/login"];

const inDevMode = process.env.DEV === "true";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host")!;
  const { pathname } = req.nextUrl;

  const isRootDomain =
    host === "buttr.io" ||
    (inDevMode && host === "localhost:3000");

  const isDashboardDomain =
    host === "dashboard.buttr.io" ||
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
            process.env.JWT_PUBLIC_KEY!,
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
        process.env.JWT_PUBLIC_KEY!,
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
          process.env.JWT_PRIVATE_KEY!,
          { algorithm: "RS256", expiresIn: "1h" }
        );

        response.cookies.set("session", newToken, {
          httpOnly: true,
          secure: true,
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