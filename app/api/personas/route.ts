"use server";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { query } from "@/lib/services/neonDB";
import { withAuthorization } from "@/app/services/server-side-services/authorization/withAuthorization";

const resource = "personas";

// withAuthorization(() => {}, { resource, isBrandScoped: false });
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const brandId = searchParams.get("brandId");
  const search = searchParams.get("search");

  if (!brandId) {
    return NextResponse.json(
      { error: "Missing brandId" },
      { status: 400 }
    );
  }

  const values: any[] = [brandId];
  const conditions: string[] = [
    "p.brand_id = $1",
    "p.deleted_at IS NULL"
  ];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`p.title ILIKE $${values.length}`);
  }

  const result = await query(
    `
    SELECT
      p.*,
      c.name AS country_name,
      s.name AS state_name,
      ci.name AS city_name
    FROM personas p
    LEFT JOIN countries c
      ON p.location_level = 'COUNTRY'
     AND p.location_id = c.id
    LEFT JOIN states s
      ON p.location_level = 'STATE'
     AND p.location_id = s.id
    LEFT JOIN cities ci
      ON p.location_level = 'CITY'
     AND p.location_id = ci.id
    WHERE ${conditions.join(" AND ")}
    ORDER BY p.created_at DESC
    `,
    values
  );

  return NextResponse.json(result);
};

// withAuthorization(()=>{}, { resource, isBrandScoped: false })
export const POST = async (req: Request) => {
  const {
    title,
    description,
    location_level,
    location_id,
    brandId
  } = await req.json();

  if (!title || !location_level || !location_id || !brandId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const personaId = crypto.randomUUID();

  try {
    await query(
      `
      INSERT INTO personas (
        id,
        title,
        description,
        location_level,
        location_id,
        brand_id
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        personaId,
        title,
        description,
        location_level,
        location_id,
        brandId
      ]
    );

    return NextResponse.json({ id: personaId });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create persona" },
      { status: 500 }
    );
  }
};

// PATCH
// DELETE