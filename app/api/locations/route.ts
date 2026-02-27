"use server";

import { NextResponse } from "next/server";
import { query } from "@/lib/services/neonDB";

export const GET = async () => {
  try {
    const result = await query(
      `
      SELECT
        c.id,
        c.name,
        c.iso_code,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', s.id,
              'name', s.name,
              'code', s.code,
              'cities',
                (
                  SELECT COALESCE(
                    json_agg(
                      jsonb_build_object(
                        'id', ci.id,
                        'name', ci.name
                      )
                      ORDER BY ci.name
                    ),
                    '[]'
                  )
                  FROM cities ci
                  WHERE ci.state_id = s.id
                    AND ci.deleted_at IS NULL
                )
            )
            ORDER BY s.name
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) AS states
      FROM countries c
      LEFT JOIN states s
        ON s.country_id = c.id
        AND s.deleted_at IS NULL
      WHERE c.deleted_at IS NULL
      GROUP BY c.id
      ORDER BY c.name;
      `
    );

    return NextResponse.json(result);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
};