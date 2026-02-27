"use server"

export type ApiAction = "read" | "write" | "update" | "delete";

export async function apiPermission(
  resource: string,
  action: ApiAction
): Promise<string> {
  return `api:${resource}:${action}`;
}