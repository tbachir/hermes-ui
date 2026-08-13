import { NextResponse } from "next/server";
import { requireHermesAccess, requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";

import { getHermesApiServer } from "@/lib/hermes/server";

type Context = { params: Promise<{ runId: string }> };

export async function GET(_: Request, context: Context) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;

  try {
    const { runId } = await context.params;
    return NextResponse.json(await getHermesApiServer().runs.get(runId));
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function DELETE(request: Request, context: Context) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;

  try {
    const { runId } = await context.params;
    return NextResponse.json(await getHermesApiServer().runs.stop(runId));
  } catch (error) {
    return hermesRouteError(error);
  }
}
