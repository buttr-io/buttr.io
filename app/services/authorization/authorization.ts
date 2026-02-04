"use server"

import { query } from "@/lib/services/neonDB";

type PermissionEffect = "allow" | "deny";

export async function canUser(
  userId: string,
  brandId: string | null,
  permission: string
): Promise<boolean> {
  const rows = await query<{ effect: PermissionEffect }>(
    `
    SELECT effect
    FROM user_brand_permissions
    WHERE user_id = $1
      AND permission = $2
      AND (
        -- Brand-scoped permission
        ($3::uuid IS NOT NULL AND brand_id = $3::uuid)
        OR
        -- Global permission
        ($3::uuid IS NULL AND brand_id IS NULL)
        OR
        -- Global fallback for brand-scoped access
        ($3::uuid IS NOT NULL AND brand_id IS NULL)
      )
    `,
    [userId, permission, brandId]
  );

  if (rows.length === 0) return false;
  if (rows.some(r => r.effect === "deny")) return false;
  return rows.some(r => r.effect === "allow");
}
