"use server";

const PERMISSIONS = {
  PAGE_GENRAL_VIEW: "page:general:view",
  
  PAGE_DASHBOARD_VIEW: "page:dashboard:view",
  PAGE_BILLING_VIEW: "page:billing:view",

  API_ANALYTICS_READ: "api:analytics:read",
  API_ANALYTICS_WRITE: "api:analytics:write",
  
  API_USER_BRANDS_READ: "api:user_brands:read",
  API_USER_BRANDS_WRITE: "api:user_brands:write",


  SUPER_ADMIN_PERMISSION: "system:super_admin:access"
};

export default async () => PERMISSIONS;