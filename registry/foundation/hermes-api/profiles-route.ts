import { NextResponse } from "next/server";
import { requireHermesAccess, requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";

import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET() {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;

  try {
    const client = getHermesManagementClient();
    const [profiles, active] = await Promise.all([
      client.profiles.list(),
      client.profiles.active(),
    ]);
    return NextResponse.json({
      profiles: profiles.profiles,
      active: active.active,
      current: active.current,
    });
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function POST(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;

  try {
    const body = (await request.json()) as { name?: string };
    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json({ error: "profile_name_required" }, { status: 400 });
    }

    const result = await getHermesManagementClient().profiles.setActive(name);
    return NextResponse.json(result);
  } catch (error) {
    return hermesRouteError(error);
  }
}
