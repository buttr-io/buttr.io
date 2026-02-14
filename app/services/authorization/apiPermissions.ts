export type ApiAction = "read" | "write" | "update" | "delete";

export function apiPermission(
  resource: string,
  action: ApiAction
): string {
  return `api:${resource}:${action}`;
}