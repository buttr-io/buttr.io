"use server"

import { ApiAction } from "./apiPermissions";

export async function actionFromMethod(method: string): Promise<ApiAction> {
  switch (method.toUpperCase()) {
    case "GET":
      return "read";
    case "POST":
      return "write";
    case "PUT":
    case "PATCH":
      return "update";
    case "DELETE":
      return "delete";
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
}
