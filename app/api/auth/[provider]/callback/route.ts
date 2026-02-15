import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { providers } from "@/lib/auth/providers";
import { query } from "@/lib/services/neonDB";
import { serialize } from "cookie";



// ***************************************************************************************************
// FIX: CURRENT WE DO NOT HAVE A ON-THE-FLY REGISTRATION FLOW BUT THIS CODE DOES IT FOR US
// CURRENTLY IT DOES NOT CAUSE ANY SECURITY ISSUE BECAUSE NEWLY CREATED USER WOULD NOT HAVE ANY PERMISSION FOR THEIR ACCOUNT
// ***************************************************************************************************


export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string; }> }
) {
  const param_provider = (await params).provider;
  const provider = providers[param_provider as keyof typeof providers];
  if (!provider) {
    return NextResponse.redirect("/login");
  }

  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect("/login");
  }

  const oauthUser = await provider.exchangeCode(code);

  // 1️⃣ Check identity
  const identity = await query(
    `
        SELECT user_id FROM user_identities
        WHERE provider = $1
            AND provider_user_id = $2
            AND deleted_at IS NULL
        `,
    [oauthUser.provider, oauthUser.providerUserId],
  );

  let userId;

  if (identity.length > 0) {
    userId = identity[0].user_id;
  } else {
    // 2️⃣ Check if user exists by email
    const existingUser = await query(
      `
            SELECT id FROM users
            WHERE email = $1
            AND deleted_at IS NULL
        `,
      [oauthUser.email],
    );

    if (existingUser.length > 0) {
      userId = existingUser[0].id;
    } else {
        
        const insertedUser = await query(
            `
                INSERT INTO users (email)
                VALUES ($1)
                RETURNING id
                `,
            [oauthUser.email],
        );

        userId = insertedUser[0].id;
    }

    // 3️⃣ Create identity mapping
    await query(
      `
            INSERT INTO user_identities
            (user_id, provider, provider_user_id, raw_profile)
            VALUES ($1, $2, $3, $4)
            `,
      [
        userId,
        oauthUser.provider,
        oauthUser.providerUserId,
        JSON.stringify(oauthUser.rawProfile),
      ],
    );
  }

  // 4️⃣ Issue your JWT
  const token = jwt.sign(
      { sub: userId },
      process.env.JWT_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      { 
        algorithm: "RS256",
        expiresIn: "72h" }
    );

    console.log("Starting redirection")
    const res = NextResponse.redirect(new URL(`${process.env.DASHBOARD_FQDN}`, req.url));

    res.cookies.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });

    return res;
}
