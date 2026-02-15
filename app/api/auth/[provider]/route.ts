import { NextRequest, NextResponse } from "next/server";
import { providers } from "@/lib/auth/providers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string; }> }
) {
    
    const param_provider = (await params).provider
    const provider = providers[param_provider as keyof typeof providers];
    
  if (!provider) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  return NextResponse.redirect(provider.getAuthorizationUrl());
}
