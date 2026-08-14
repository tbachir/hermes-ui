import "server-only";

import {
  createHermesConnectionUnchecked,
  type HermesApiServerApi,
  type HermesConnection,
  type HermesRuntimeClient,
} from "@burner-io/hermes";

import { getHermesServerEnv } from "@/lib/hermes/env";

let connection: HermesConnection | undefined;

/**
 * Single trusted machine connection to Hermes.
 *
 * @burner-io/hermes >= 0.6 owns the mapping from one application-level
 * HERMES_URL + HERMES_API_KEY pair to its native control and Runs/API facades.
 * The facades are typed views over one private origin, not separate servers or
 * authentication models.
 */
export function getHermesConnection(): HermesConnection {
  if (connection) return connection;

  const env = getHermesServerEnv();
  connection = createHermesConnectionUnchecked({
    baseUrl: env.url,
    apiKey: env.apiKey,
  });

  return connection;
}

/** Compatibility getter for existing explicit control-plane BFF routes. */
export function getHermesControlClient(): HermesRuntimeClient {
  return getHermesConnection().control;
}

/** Compatibility getter for native Runs and API Server resources. */
export function getHermesApiServer(): HermesApiServerApi {
  return getHermesConnection().apiServer;
}

/**
 * Historical name retained so installing the updated foundation does not force
 * consumers to rewrite existing route handlers in the same migration.
 */
export const getHermesManagementClient = getHermesControlClient;
