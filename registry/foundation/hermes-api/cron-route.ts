import { NextResponse } from "next/server";
import type { HermesCronJobCreateRequest } from "@burner-io/hermes/contracts";
import { requireHermesAccess, requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET(request: Request) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;
  try {
    const profile = new URL(request.url).searchParams.get("profile") ?? undefined;
    const api = getHermesManagementClient().cron;
    const [jobs, targets, blueprints] = await Promise.all([
      api.list(profile), api.deliveryTargets(), api.blueprints(),
    ]);
    return NextResponse.json({ jobs, targets: targets.targets, blueprints: blueprints.blueprints });
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function POST(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const body = (await request.json()) as HermesCronJobCreateRequest & { profile?: string };
    if (!body.schedule?.trim()) return NextResponse.json({ error: "schedule_required" }, { status: 400 });
    const { profile, ...input } = body;
    return NextResponse.json(await getHermesManagementClient().cron.create(input, profile));
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function PATCH(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const body = (await request.json()) as {
      action?: "pause" | "resume" | "trigger";
      id?: string;
      profile?: string;
    };
    if (!body.id?.trim() || !body.action) return NextResponse.json({ error: "id_and_action_required" }, { status: 400 });
    const api = getHermesManagementClient().cron;
    if (body.action === "pause") return NextResponse.json(await api.pause(body.id, body.profile));
    if (body.action === "resume") return NextResponse.json(await api.resume(body.id, body.profile));
    return NextResponse.json(await api.trigger(body.id, body.profile));
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function DELETE(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id")?.trim();
    const profile = url.searchParams.get("profile") ?? undefined;
    if (!id) return NextResponse.json({ error: "id_required" }, { status: 400 });
    return NextResponse.json(await getHermesManagementClient().cron.remove(id, profile));
  } catch (error) {
    return hermesRouteError(error);
  }
}
