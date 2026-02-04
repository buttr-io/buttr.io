"use server";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { query } from "@/lib/services/neonDB";

// Create new brands
export async function POST(req: Request) {
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
}
