import { NextResponse } from "next/server";
import type { HermesAudioSpeakRequest } from "@burner-io/hermes/contracts";
import { requireHermesAccess, requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET(request: Request) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;
  try {
    const profile = new URL(request.url).searchParams.get("profile") ?? undefined;
    return NextResponse.json(await getHermesManagementClient().audio.elevenLabsVoices(profile));
  } catch (error) { return hermesRouteError(error); }
}

export async function POST(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const url = new URL(request.url);
    const profile = url.searchParams.get("profile") ?? undefined;
    const body = (await request.json()) as HermesAudioSpeakRequest;
    if (!body.text?.trim()) return NextResponse.json({ error: "text_required" }, { status: 400 });
    return NextResponse.json(await getHermesManagementClient().audio.speak(body, profile));
  } catch (error) { return hermesRouteError(error); }
}
