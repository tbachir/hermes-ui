import "server-only";

export interface HermesServerEnv {
  url: string;
  apiKey: string;
}

function required(name: "HERMES_URL" | "HERMES_API_KEY"): string {
  const current = process.env[name]?.trim();
  if (!current) throw new Error(`${name} is required`);
  return current;
}

export function getHermesServerEnv(): HermesServerEnv {
  return {
    url: required("HERMES_URL").replace(/\/+$/, ""),
    apiKey: required("HERMES_API_KEY"),
  };
}
