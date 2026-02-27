"use server"

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { canUser } from "@/app/services/server-side-services/authorization/authorization";
import { apiPermission } from "./apiPermissions";
import { actionFromMethod } from "./httpActions";

type Handler = (req: Request, { params }?: any) => Promise<Response>;

export async function withAuthorization(
  handler: Handler,
  options: {
    resource: string;
    isBrandScoped?: boolean; // default true
  }
): Promise<Handler> {
  return async function authorizedHandler(req: Request) {
    const userId = (await headers()).get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthenticated" },
        { status: 401 }
      );
    }

    const action = await actionFromMethod(req.method);
    const permission = await apiPermission(options.resource, action);

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
    

    return (await handler(req));
  };
}
