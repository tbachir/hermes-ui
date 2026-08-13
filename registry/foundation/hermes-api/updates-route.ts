import { NextResponse } from "next/server";
import { requireHermesAccess, requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET(request: Request) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;
  try {
    const force = new URL(request.url).searchParams.get("force") === "1";
    return NextResponse.json(await getHermesManagementClient().updates.check(force));
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function POST(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    return NextResponse.json(await getHermesManagementClient().updates.apply());
  } catch (error) {
    return hermesRouteError(error);
  }
}
