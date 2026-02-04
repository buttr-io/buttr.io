"use server"

import { headers } from "next/headers";
import Authorization from "../services/authorization/permissions";
import { canUser } from "../services/authorization/authorization";
import { redirect } from "next/navigation";
import Dashboard from "./Components/Dashboard";
const permissions = (await Authorization())

export default async function DashboardPage({ searchParams }: {searchParams: Promise<any>}) {
    const userId = (await headers()).get("x-user-id")!;
    const brandId = (await searchParams).brand_id
    if(!brandId) redirect("/page-not-found")
    // If brand_id is not available then we need to get user available brand id's pick the first one

    if (!await canUser(userId, brandId, permissions.PAGE_DASHBOARD_VIEW)) {
        redirect("/no-access");
    }

    return <Dashboard />;
}
