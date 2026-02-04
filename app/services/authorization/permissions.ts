"use server";

const PERMISSIONS = {
  PAGE_DASHBOARD_VIEW: "page:dashboard:view",
  PAGE_BILLING_VIEW: "page:billing:view",

  API_ANALYTICS_READ: "api:analytics:read",
  API_ANALYTICS_WRITE: "api:analytics:write",

  BRAND_MEMBERS_MANAGE: "brand:members:manage",
  BRAND_SETTINGS_CONFIGURE: "brand:settings:configure",
};

export default async () => PERMISSIONS;