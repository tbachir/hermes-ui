import { NextResponse } from "next/server";

import { requireHermesAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesApiServer } from "@/lib/hermes/server";

interface ToolsetsResponse {
  data?: unknown[];
  platform?: string;
}

export async function GET() {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;

  try {
    const result = await getHermesApiServer().raw<ToolsetsResponse>("GET", "/v1/toolsets");
    return NextResponse.json({
      toolsets: Array.isArray(result.data) ? result.data : [],
      ...(result.platform ? { platform: result.platform } : {}),
    });
  } catch (error) {
    return hermesRouteError(error);
  }
}
