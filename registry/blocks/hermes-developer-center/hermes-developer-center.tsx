"use client";

import { HermesConfigOverview } from "@/components/hermes/hermes-config-overview";
import { HermesEnvManager } from "@/components/hermes/hermes-env-manager";
import { HermesFileBrowser } from "@/components/hermes/hermes-file-browser";
import { HermesGitStatus } from "@/components/hermes/hermes-git-status";
import { HermesLogViewer } from "@/components/hermes/hermes-log-viewer";
import { HermesOperationsPanel } from "@/components/hermes/hermes-operations-panel";

export function HermesDeveloperCenter() {
  return <div className="grid gap-5 xl:grid-cols-2"><HermesConfigOverview /><HermesOperationsPanel /><HermesEnvManager /><HermesFileBrowser /><HermesGitStatus /><HermesLogViewer /></div>;
}
