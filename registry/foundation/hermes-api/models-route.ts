import { NextResponse } from "next/server";

import { requireHermesAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesApiServer } from "@/lib/hermes/server";

export async function GET(request: Request) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;

  try {
    const refresh = new URL(request.url).searchParams.get("refresh");
    const hermes = getHermesApiServer();
    const [models, options] = await Promise.all([
      hermes.models(),
      hermes.raw("GET", "/api/model/options", {
        ...(refresh ? { query: { refresh } } : {}),
      }),
    ]);

    return NextResponse.json({ models, options });
  } catch (error) {
    return hermesRouteError(error);
  }
}
