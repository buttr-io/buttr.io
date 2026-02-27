"use server";

import { NextResponse } from "next/server";
import { query } from "@/lib/services/neonDB";
import { withAuthorization } from "@/app/services/server-side-services/authorization/withAuthorization";

const resource = "prompts";

export const PATCH = await withAuthorization(async (
    req: Request,
    { params }: { params: { id: string } }
) => {
  const { status } = await req.json();

  await query(
    `
    UPDATE prompts
    SET status = $1
    WHERE id = $2 AND deleted_at IS NULL
    `,
    [status, params.id]
  );

  return NextResponse.json({ success: true });
}, { resource, isBrandScoped: false });