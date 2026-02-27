"use server";

import { NextResponse } from "next/server";
import { query } from "@/lib/services/neonDB";
import { withAuthorization } from "@/app/services/server-side-services/authorization/withAuthorization";

const resource = "logs";

export const GET = await withAuthorization(async () => {
  const result = await query(
    `
    SELECT *
    FROM logs
    WHERE deleted_at IS NULL
    ORDER BY created_at DESC
    LIMIT 100
    `
  );

  return NextResponse.json(result);
}, { resource, isBrandScoped: false });