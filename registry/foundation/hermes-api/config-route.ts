import { NextResponse } from "next/server";
import { requireHermesAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

function safeConfig(config: Record<string, unknown>) {
  const section = (name: string) => {
    const value = config[name];
    return value && typeof value === "object" ? value as Record<string, unknown> : {};
  };
  const pick = (source: Record<string, unknown>, keys: string[]) =>
    Object.fromEntries(keys.filter((key) => key in source).map((key) => [key, source[key]]));
  return {
    agent: pick(section("agent"), ["reasoning_effort", "service_tier"]),
    display: pick(section("display"), ["personality", "skin", "interim_assistant_messages"]),
    desktop: pick(section("desktop"), ["repo_scan_enabled", "repo_scan_roots", "repo_scan_exclude_paths"]),
    terminal: pick(section("terminal"), ["cwd", "font_family"]),
    stt: pick(section("stt"), ["enabled"]),
    voice: pick(section("voice"), ["max_recording_seconds", "auto_tts"]),
  };
}

export async function GET(request: Request) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;
  try {
    const profile = new URL(request.url).searchParams.get("profile") ?? undefined;
    const api = getHermesManagementClient().config;
    const [config, schema] = await Promise.all([api.get(profile), api.schema()]);
    return NextResponse.json({ config: safeConfig(config), categories: schema.category_order ?? [], fields: Object.keys(schema.fields) });
  } catch (error) {
    return hermesRouteError(error);
  }
}
