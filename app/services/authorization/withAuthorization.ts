import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { canUser } from "@/app/services/authorization/authorization";
import { apiPermission } from "./apiPermissions";
import { actionFromMethod } from "./httpActions";

type Handler = (req: Request) => Promise<Response>;

export function withAuthorization(
  handler: Handler,
  options: {
    resource: string;
    isBrandScoped?: boolean; // default true
  }
): Handler {
  return async function authorizedHandler(req: Request) {
    const userId = (await headers()).get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthenticated" },
        { status: 401 }
      );
    }

    const action = actionFromMethod(req.method);
    const permission = apiPermission(options.resource, action);

    // Extract brand_id if applicable
    const url = new URL(req.url);
    const brandId = options.isBrandScoped === false
      ? null
      : url.searchParams.get("brand_id");

    const allowed = await canUser(userId, brandId, permission);

    if (!allowed) {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 403 }
      );
    }

    return handler(req);
  };
}
