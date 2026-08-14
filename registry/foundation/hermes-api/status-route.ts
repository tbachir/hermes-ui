import { NextResponse } from "next/server";

import { requireHermesAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesApiServer } from "@/lib/hermes/server";

export async function GET() {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;

  try {
    const hermes = getHermesApiServer();
    const [health, capabilities] = await Promise.all([
      hermes.health(true),
      hermes.capabilities(),
    ]);

    return NextResponse.json({ health, capabilities });
  } catch (error) {
    return hermesRouteError(error);
  }
}
