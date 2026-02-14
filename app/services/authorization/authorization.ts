"use server";

import { query } from "@/lib/services/neonDB";
import permissions from "./permissions";

type PermissionEffect = "allow" | "deny";

export async function canUser(
  userId: string,
  brandId: string | null,
  permission: string
): Promise<boolean> {

  if((await checkSuperAdmin(userId))) return true;

  const rows = await query<{ effect: PermissionEffect }>(
    `
    SELECT effect
    FROM user_brand_permissions
    WHERE user_id = $1
      AND permission = $2
      AND deleted_at IS NULL
      AND (
        -- Case 1: brand is specified → check that brand or global
        ($3::uuid IS NOT NULL AND (brand_id = $3::uuid OR brand_id IS NULL))

        OR

        -- Case 2: no brand selected → check ANY brand or global
        ($3::uuid IS NULL)
      )
    `,
    [userId, permission, brandId]
  );

  if (rows.length === 0) return false;

  // Explicit deny always wins
  if (rows.some(r => r.effect === "deny")) return false;

  return rows.some(r => r.effect === "allow");
}

async function checkSuperAdmin(userId: string){
  // 1️⃣ Super admin short-circuit
  const superAdmin = await query(
    `
    SELECT 1
    FROM user_brand_permissions
    WHERE user_id = $1
      AND permission = $2
      AND brand_id IS NULL
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [userId, (await permissions()).SUPER_ADMIN_PERMISSION]
  );

  if (superAdmin.length > 0) {
    return true;
  }
}