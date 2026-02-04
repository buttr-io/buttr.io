import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { query } from "@/lib/services/neonDB";

type Brand = {
  id: string;
  name: string;
};

export async function GET() {
  const userId = (await headers()).get("x-user-id");

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthenticated" },
      { status: 401 }
    );
  }

  const brands = await query<Brand>(
    `
    SELECT b.id, b.name
    FROM brands b
    INNER JOIN brand_memberships bm
      ON bm.brand_id = b.id
    WHERE bm.user_id = $1
    ORDER BY b.created_at DESC
    `,
    [userId]
  );

  return NextResponse.json({ brands });
}
