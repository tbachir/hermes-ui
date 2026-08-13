import { NextResponse } from "next/server";
import type { HermesModelAssignmentRequest } from "@burner-io/hermes/contracts";
import { requireHermesAccess, requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET(request: Request) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;

  try {
    const profile = new URL(request.url).searchParams.get("profile") ?? undefined;
    const client = getHermesManagementClient();
    const [info, options, auxiliary] = await Promise.all([
      client.models.info(profile),
      client.models.options({ ...(profile ? { profile } : {}), pricing: true, capabilities: true }),
      client.models.auxiliary(profile),
    ]);
    return NextResponse.json({ info, options, auxiliary });
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function POST(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;

  try {
    const body = (await request.json()) as HermesModelAssignmentRequest;
    if (!body.scope || !body.provider?.trim() || !body.model?.trim()) {
      return NextResponse.json({ error: "scope_provider_model_required" }, { status: 400 });
    }
    return NextResponse.json(await getHermesManagementClient().models.set(body));
  } catch (error) {
    return hermesRouteError(error);
  }
}
