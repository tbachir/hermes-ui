import { NextResponse } from "next/server";
import { isHermesRemotePathAllowed, requireHermesAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET(request: Request) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;
  const path = new URL(request.url).searchParams.get("path")?.trim();
  if (!path) return NextResponse.json({ error: "path_required" }, { status: 400 });
  if (!isHermesRemotePathAllowed(path, process.env.HERMES_UI_GIT_ROOTS ?? "")) {
    return NextResponse.json({ error: "git_path_not_allowed" }, { status: 403 });
  }
  try {
    const api = getHermesManagementClient().git;
    const [status, branches, worktrees] = await Promise.all([api.status(path), api.branches(path), api.worktrees(path)]);
    return NextResponse.json({ status, branches: branches.branches, worktrees: worktrees.worktrees });
  } catch (error) { return hermesRouteError(error); }
}
