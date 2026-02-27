"use server";

import { NextResponse } from "next/server";
import { query } from "@/lib/services/neonDB";

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const {
    title,
    description,
    location_level,
    location_id,
    brandId
  } = await req.json();

  if (!brandId) {
    return NextResponse.json(
      { error: "Missing brandId" },
      { status: 400 }
    );
  }

  await query(
    `
    UPDATE personas
    SET
      title = $1,
      description = $2,
      location_level = $3,
      location_id = $4
    WHERE id = $5
      AND brand_id = $6
      AND deleted_at IS NULL
    `,
    [
      title,
      description,
      location_level,
      location_id,
      params.id,
      brandId
    ]
  );

  return NextResponse.json({ success: true });
};

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { brandId } = await req.json();

  if (!brandId) {
    return NextResponse.json(
      { error: "Missing brandId" },
      { status: 400 }
    );
  }

  await query(
    `
    UPDATE personas
    SET deleted_at = NOW()
    WHERE id = $1
      AND brand_id = $2
      AND deleted_at IS NULL
    `,
    [params.id, brandId]
  );

  return NextResponse.json({ success: true });
};