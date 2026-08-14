import { NextResponse } from "next/server";
import type { HermesSkillCreateRequest, HermesSkillToggleRequest } from "@burner-io/hermes/contracts";
import { requireHermesAccess, requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET(request: Request) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;

  try {
    const profile = new URL(request.url).searchParams.get("profile") ?? undefined;
    const skills = await getHermesManagementClient().skills.list(profile);
    return NextResponse.json(skills);
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function POST(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;

  try {
    const body = (await request.json()) as HermesSkillCreateRequest;
    if (!body.name?.trim() || !body.content?.trim()) {
      return NextResponse.json({ error: "name_and_content_required" }, { status: 400 });
    }
    return NextResponse.json(await getHermesManagementClient().skills.create(body));
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function PATCH(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;

  try {
    const body = (await request.json()) as Partial<HermesSkillToggleRequest>;
    if (!body.name?.trim() || typeof body.enabled !== "boolean") {
      return NextResponse.json({ error: "name_and_enabled_required" }, { status: 400 });
    }
    return NextResponse.json(
      await getHermesManagementClient().skills.toggle({
        name: body.name,
        enabled: body.enabled,
        ...(body.profile !== undefined ? { profile: body.profile } : {}),
      }),
    );
  } catch (error) {
    return hermesRouteError(error);
  }
}
