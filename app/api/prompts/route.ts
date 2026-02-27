


"use server";

import { NextResponse } from "next/server";
import { query } from "@/lib/services/neonDB";
import { withAuthorization } from "@/app/services/server-side-services/authorization/withAuthorization";

const resource = "prompts";

// withAuthorization(, { resource, isBrandScoped: false })
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const personaId = searchParams.get("personaId");

  const conditions: string[] = ["p.deleted_at IS NULL"];
  const values: any[] = [];

  if (status && status !== "All") {
    values.push(status);
    conditions.push(`p.status = $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`p.question ILIKE $${values.length}`);
  }

  if (personaId) {
    values.push(personaId);
    conditions.push(`
      EXISTS (
        SELECT 1 FROM prompt_personas pp
        WHERE pp.prompt_id = p.id
        AND pp.persona_id = $${values.length}
        AND pp.deleted_at IS NULL
      )
    `);
  }

  const prompts = await query(
    `
    SELECT
      p.*,
      COALESCE(
        json_agg(DISTINCT t.name)
        FILTER (WHERE t.name IS NOT NULL),
        '[]'
      ) AS tags,
      COALESCE(
        json_agg(DISTINCT pp.persona_id)
        FILTER (WHERE pp.persona_id IS NOT NULL),
        '[]'
      ) AS personas
    FROM prompts p
    LEFT JOIN prompt_tags pt ON pt.prompt_id = p.id AND pt.deleted_at IS NULL
    LEFT JOIN tags t ON t.id = pt.tag_id AND t.deleted_at IS NULL
    LEFT JOIN prompt_personas pp ON pp.prompt_id = p.id AND pp.deleted_at IS NULL
    WHERE ${conditions.join(" AND ")}
    GROUP BY p.id
    ORDER BY p.created_at DESC
    `,
    values
  );

  return NextResponse.json(prompts);
};

// withAuthorization(()=>{}, { resource, isBrandScoped: false })
export const POST = async (req: Request) => {
    const { question, status, personaIds, tagNames, brandId } = await req.json();

    if (!question) {
        return NextResponse.json(
        { error: "Missing question" },
        { status: 400 }
        );
    }

    const promptId = crypto.randomUUID();

    await query("BEGIN");
    try {
        await query(
        `
        INSERT INTO prompts (id, question, status, brand_id)
        VALUES ($1, $2, $3, $4)
        `,
        [promptId, question, status || "Active", brandId]
        );

        if (personaIds?.length) {
            for (const pid of personaIds) {
                await query(
                    `
                    INSERT INTO prompt_personas (prompt_id, persona_id)
                    VALUES ($1, $2)
                    `,
                    [promptId, pid]
                );
            }
        }

        if (tagNames?.length) {
            for (const tag of tagNames) {
            const tagRes = await query(
                    `
                    INSERT INTO tags (id, name, brand_id)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (brand_id, name)
                    DO UPDATE SET name = EXCLUDED.name
                    RETURNING id
                    `,
                    [crypto.randomUUID(), tag, brandId]
                );

            const tagId = tagRes[0].id;

            await query(
                `
                INSERT INTO prompt_tags (prompt_id, tag_id)
                VALUES ($1, $2)
                `,
                [promptId, tagId]
            );
            }
        }
    } catch(e){
        throw e
    }
    
    await query("COMMIT");

    return NextResponse.json({ id: promptId });
};
// PATCH
// DELETE