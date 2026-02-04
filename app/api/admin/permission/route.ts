"use server";

import { NextResponse } from "next/server";
import { query } from "@/lib/services/neonDB";

export async function POST(req: Request) {
  const { user_id, brand_id, permission, effect } = await req.json();

  if (!user_id || !brand_id || !permission || !effect) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  if (effect !== "allow" && effect !== "deny") {
    return NextResponse.json(
      { error: "Invalid effect" },
      { status: 400 }
    );
  }

  try {
    await query("BEGIN");

    // 1️⃣ Ensure brand membership exists
    await query(
      `
      INSERT INTO brand_memberships (user_id, brand_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, brand_id) DO NOTHING
      `,
      [user_id, brand_id]
    );

    // 2️⃣ Upsert permission
    await query(
      `
      INSERT INTO user_brand_permissions
        (user_id, brand_id, permission, effect)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, permission, brand_id)
      DO UPDATE SET effect = EXCLUDED.effect
      `,
      [user_id, brand_id, permission, effect]
    );

    await query("COMMIT");

    return NextResponse.json({ success: true });

  } catch (err) {
    await query("ROLLBACK");
    console.error("Failed to update permission:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
