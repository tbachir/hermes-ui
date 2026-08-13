import { NextResponse } from "next/server";
import type { HermesCredentialPoolAddRequest } from "@burner-io/hermes/contracts";
import { requireHermesAccess, requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET() {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;
  try {
    return NextResponse.json(await getHermesManagementClient().credentials.pool());
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function POST(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const body = (await request.json()) as HermesCredentialPoolAddRequest;
    if (!body.provider?.trim() || !body.api_key?.trim()) return NextResponse.json({ error: "provider_and_api_key_required" }, { status: 400 });
    return NextResponse.json(await getHermesManagementClient().credentials.add(body));
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function DELETE(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const url = new URL(request.url);
    const provider = url.searchParams.get("provider")?.trim();
    const index = Number(url.searchParams.get("index"));
    if (!provider || !Number.isInteger(index) || index < 1) return NextResponse.json({ error: "provider_and_index_required" }, { status: 400 });
    return NextResponse.json(await getHermesManagementClient().credentials.remove(provider, index));
  } catch (error) {
    return hermesRouteError(error);
  }
}
