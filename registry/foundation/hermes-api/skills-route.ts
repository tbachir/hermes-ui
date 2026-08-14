import { NextResponse } from "next/server";

import { requireHermesAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesApiServer } from "@/lib/hermes/server";

interface ListResponse {
  data?: unknown[];
}

export async function GET() {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;

  try {
    const result = await getHermesApiServer().raw<ListResponse>("GET", "/v1/skills");
    return NextResponse.json({ skills: Array.isArray(result.data) ? result.data : [] });
  } catch (error) {
    return hermesRouteError(error);
  }
}
