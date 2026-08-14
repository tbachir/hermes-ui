import { NextResponse } from "next/server";
import { requireHermesAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";

import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET() {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;

  try {
    const client = getHermesManagementClient();
    const [status, stats] = await Promise.all([
      client.system.status(),
      client.system.stats(),
    ]);
    return NextResponse.json({ status, stats });
  } catch (error) {
    return hermesRouteError(error);
  }
}
