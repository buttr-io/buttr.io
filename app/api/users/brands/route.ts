"use server"

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { query } from "@/lib/services/neonDB";
import { withAuthorization } from "@/app/services/server-side-services/authorization/withAuthorization";

type Brand = {
  id: string;
  name: string;
};

const resource = "user_brands";

export const GET = withAuthorization(async () => {
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
      AND b.deleted_at IS NULL
      AND bm.deleted_at IS NULL
    ORDER BY b.created_at DESC;
    `,
    [userId]
  );

  return NextResponse.json({ brands });
}, {resource, isBrandScoped: false})
