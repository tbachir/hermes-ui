import { NextResponse } from "next/server";
import type { HermesEnvVarDeleteRequest, HermesEnvVarUpdateRequest } from "@burner-io/hermes/contracts";
import { requireHermesAccess, requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET(request: Request) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;
  try {
    const profile = new URL(request.url).searchParams.get("profile") ?? undefined;
    return NextResponse.json(await getHermesManagementClient().env.list(profile));
  } catch (error) { return hermesRouteError(error); }
}

export async function POST(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const body = (await request.json()) as HermesEnvVarUpdateRequest;
    if (!body.key?.trim() || !body.value) return NextResponse.json({ error: "key_and_value_required" }, { status: 400 });
    return NextResponse.json(await getHermesManagementClient().env.set(body));
  } catch (error) { return hermesRouteError(error); }
}

export async function DELETE(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const body = (await request.json()) as HermesEnvVarDeleteRequest;
    if (!body.key?.trim()) return NextResponse.json({ error: "key_required" }, { status: 400 });
    return NextResponse.json(await getHermesManagementClient().env.remove(body));
  } catch (error) { return hermesRouteError(error); }
}
