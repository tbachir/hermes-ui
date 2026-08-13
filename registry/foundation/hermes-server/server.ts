import "server-only";

import {
  createApiServerApi,
  createHermesClientUnchecked,
  type HermesApiServerApi,
  type HermesRuntimeClient,
} from "@burner-io/hermes";

import {
  getHermesServerEnv,
  requireHermesApiServerUrl,
  requireHermesDashboardUrl,
} from "@/lib/hermes/env";

let managementClient: HermesRuntimeClient | undefined;
let apiServerClient: HermesApiServerApi | undefined;

export function getHermesManagementClient(): HermesRuntimeClient {
  if (managementClient) {
    return managementClient;
  }

  const env = getHermesServerEnv();

  managementClient = createHermesClientUnchecked({
    baseUrl: requireHermesDashboardUrl(),
    ...(env.sessionToken ? { sessionToken: env.sessionToken } : {}),
    ...(env.bearerToken ? { bearerToken: env.bearerToken } : {}),
    ...(env.defaultProfile ? { profile: env.defaultProfile } : {}),
    probeOnCreate: false,
  });

  return managementClient;
}

export function getHermesApiServer(): HermesApiServerApi {
  if (apiServerClient) {
    return apiServerClient;
  }

  const env = getHermesServerEnv();

  apiServerClient = createApiServerApi({
    baseUrl: requireHermesApiServerUrl(),
    ...(env.apiServerKey ? { apiKey: env.apiServerKey } : {}),
    ...(env.defaultProfile ? { profile: env.defaultProfile } : {}),
  });

  return apiServerClient;
}
