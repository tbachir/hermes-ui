"use client";

import { HermesMcpManager } from "@/components/hermes/hermes-mcp-manager";
import { HermesSkillManager } from "@/components/hermes/hermes-skill-manager";
import { HermesToolsetManager } from "@/components/hermes/hermes-toolset-manager";

export function HermesCapabilitiesCenter({ profile }: { profile?: string }) {
  return <div className="grid gap-6 xl:grid-cols-2"><HermesSkillManager {...(profile ? { profile } : {})} /><HermesMcpManager {...(profile ? { profile } : {})} /><div className="xl:col-span-2"><HermesToolsetManager {...(profile ? { profile } : {})} /></div></div>;
}
