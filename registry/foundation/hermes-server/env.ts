import "server-only";

export interface HermesServerEnv {
  dashboardUrl?: string;
  sessionToken?: string;
  bearerToken?: string;
  apiServerUrl?: string;
  apiServerKey?: string;
  defaultProfile?: string;
}

function value(name: string): string | undefined {
  const current = process.env[name]?.trim();
  return current ? current : undefined;
}

export function getHermesServerEnv(): HermesServerEnv {
  const dashboardUrl = value("HERMES_DASHBOARD_URL");
  const sessionToken = value("HERMES_SESSION_TOKEN");
  const bearerToken = value("HERMES_BEARER_TOKEN");
  const apiServerUrl = value("HERMES_API_SERVER_URL");
  const apiServerKey = value("HERMES_API_SERVER_KEY");
  const defaultProfile = value("HERMES_DEFAULT_PROFILE");

  return {
    ...(dashboardUrl ? { dashboardUrl } : {}),
    ...(sessionToken ? { sessionToken } : {}),
    ...(bearerToken ? { bearerToken } : {}),
    ...(apiServerUrl ? { apiServerUrl } : {}),
    ...(apiServerKey ? { apiServerKey } : {}),
    ...(defaultProfile ? { defaultProfile } : {}),
  };
}

export function requireHermesDashboardUrl(): string {
  const url = getHermesServerEnv().dashboardUrl;
  if (!url) {
    throw new Error("HERMES_DASHBOARD_URL is not configured");
  }
  return url;
}

export function requireHermesApiServerUrl(): string {
  const url = getHermesServerEnv().apiServerUrl;
  if (!url) {
    throw new Error("HERMES_API_SERVER_URL is not configured");
  }
  return url;
}
