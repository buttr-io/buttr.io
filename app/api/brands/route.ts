"use server";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { query } from "@/lib/services/neonDB";
import { withAuthorization } from "@/app/services/server-side-services/authorization/withAuthorization";

const resource = "brands"

// Create new brands
export const POST = await withAuthorization(async (req: Request) => {
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Missing name" }, { status: 400 });
  }

  const brandId = crypto.randomUUID();

  await query(
    `
    INSERT INTO brands (id, name)
    VALUES ($1, $2)
    `,
    [brandId, name]
  );

  return NextResponse.json({ brand_id: brandId });
}, {resource, isBrandScoped: false})
