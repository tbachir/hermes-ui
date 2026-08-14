import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = JSON.parse(fs.readFileSync(path.join(root, "registry.json"), "utf8"));
const errors = [];
const names = new Set();
const items = [];
const activeFiles = new Set();

const itemTypes = new Set([
  "registry:lib",
  "registry:block",
  "registry:component",
  "registry:ui",
  "registry:hook",
  "registry:theme",
  "registry:page",
  "registry:file",
  "registry:style",
  "registry:base",
  "registry:font",
  "registry:item",
]);

const fileTypes = new Set([
  "registry:lib",
  "registry:block",
  "registry:component",
  "registry:ui",
  "registry:hook",
  "registry:theme",
  "registry:page",
  "registry:file",
  "registry:style",
  "registry:base",
  "registry:item",
]);

const deprecatedHermesEnv = new Set([
  "HERMES_DASHBOARD_URL",
  "HERMES_SESSION_TOKEN",
  "HERMES_BEARER_TOKEN",
  "HERMES_API_SERVER_URL",
  "HERMES_API_SERVER_KEY",
  "HERMES_DEFAULT_PROFILE",
]);

if (!source.include?.length) {
  errors.push("registry.json must use include for this repository layout.");
}

for (const include of source.include ?? []) {
  const includePath = path.join(root, include);
  if (!fs.existsSync(includePath)) {
    errors.push(`Missing include: ${include}`);
    continue;
  }

  const registry = JSON.parse(fs.readFileSync(includePath, "utf8"));
  const base = path.dirname(includePath);

  for (const item of registry.items ?? []) {
    items.push({ item, include });

    if (names.has(item.name)) errors.push(`Duplicate item name: ${item.name}`);
    names.add(item.name);

    if (!item.name || !item.type || !item.title) {
      errors.push(`Invalid item in ${include}: ${JSON.stringify(item)}`);
      continue;
    }

    if (!itemTypes.has(item.type)) {
      errors.push(`Unsupported item type for ${item.name}: ${item.type}`);
    }

    for (const envName of Object.keys(item.envVars ?? {})) {
      if (deprecatedHermesEnv.has(envName)) {
        errors.push(`Deprecated Hermes env var in active item ${item.name}: ${envName}`);
      }
      if (/^NEXT_PUBLIC_HERMES_/.test(envName)) {
        errors.push(`Hermes configuration exposed as NEXT_PUBLIC_* in active item ${item.name}: ${envName}`);
      }
    }

    for (const file of item.files ?? []) {
      if (!file.path || !file.type) {
        errors.push(`Invalid file declaration for ${item.name}: ${JSON.stringify(file)}`);
        continue;
      }
      if (!fileTypes.has(file.type)) {
        errors.push(`Unsupported file type for ${item.name}: ${file.type}`);
      }
      if (["registry:file", "registry:page"].includes(file.type) && !file.target) {
        errors.push(`Missing required target for ${item.name}:${file.path}`);
      }

      const sourcePath = path.join(base, file.path);
      if (!fs.existsSync(sourcePath)) {
        errors.push(`Missing source file for ${item.name}: ${path.relative(root, sourcePath)}`);
      } else {
        activeFiles.add(sourcePath);
      }
    }
  }
}

for (const { item } of items) {
  for (const dependency of item.registryDependencies ?? []) {
    const match = dependency.match(/^tbachir\/hermes-ui\/([^#]+)(?:#.+)?$/);
    if (match && !names.has(match[1])) {
      errors.push(`Unknown same-repository dependency for ${item.name}: ${dependency}`);
    }
  }
}

for (const file of activeFiles) {
  const content = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file);

  if (/NEXT_PUBLIC_HERMES_/.test(content)) {
    errors.push(`Hermes configuration exposed as NEXT_PUBLIC_* in active source: ${relative}`);
  }

  if (/HERMES_(?:DASHBOARD_URL|SESSION_TOKEN|BEARER_TOKEN|API_SERVER_URL|API_SERVER_KEY|DEFAULT_PROFILE)/.test(content)) {
    errors.push(`Deprecated Hermes connection variable found in active source: ${relative}`);
  }

  if (/@tbachir\/(?:hermes|workflow)/.test(content)) {
    errors.push(`Legacy package import found in active registry source: ${relative}`);
  }

  if (/\/api\/hermes\/proxy/.test(content)) {
    errors.push(`Generic Hermes proxy detected in active source: ${relative}`);
  }
}

const serverFoundationPath = path.join(root, "registry/foundation/hermes-server/server.ts");
if (fs.existsSync(serverFoundationPath)) {
  const serverFoundation = fs.readFileSync(serverFoundationPath, "utf8");

  if (!/createHermesConnectionUnchecked/.test(serverFoundation)) {
    errors.push("Hermes server foundation must use @burner-io/hermes 0.6 createHermesConnectionUnchecked().");
  }
  if (!/baseUrl:\s*env\.url/.test(serverFoundation)) {
    errors.push("Hermes connection must use env.url / HERMES_URL.");
  }
  if (!/apiKey:\s*env\.apiKey/.test(serverFoundation)) {
    errors.push("Hermes connection must use env.apiKey / HERMES_API_KEY.");
  }
  if (/createHermesClientUnchecked|createApiServerApi/.test(serverFoundation)) {
    errors.push("Hermes server foundation must not manually construct separate control/API clients on Hermes >=0.6.");
  }
  if (!/getHermesConnection\(\)\.control/.test(serverFoundation)) {
    errors.push("Hermes control compatibility getter must resolve from the unified HermesConnection.");
  }
  if (!/getHermesConnection\(\)\.apiServer/.test(serverFoundation)) {
    errors.push("Hermes API compatibility getter must resolve from the unified HermesConnection.");
  }
}

const hermesServerItem = items.find(({ item }) => item.name === "hermes-server")?.item;
if (hermesServerItem) {
  const dependencies = hermesServerItem.dependencies ?? [];
  if (!dependencies.includes("@burner-io/hermes@^0.6.0")) {
    errors.push("hermes-server must install @burner-io/hermes@^0.6.0.");
  }
}

const sourceFiles = [];
for (const directory of ["docs", "scripts"]) {
  const start = path.join(root, directory);
  const stack = fs.existsSync(start) ? [start] : [];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const next = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(next);
      else sourceFiles.push(next);
    }
  }
}

for (const file of sourceFiles) {
  const content = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file);

  if (/NEXT_PUBLIC_HERMES_(?:URL|API_KEY|SESSION|BEARER)/.test(content)) {
    errors.push(`Hermes credential/config exposed as NEXT_PUBLIC_* in ${relative}`);
  }

  if (/@tbachir\/(?:hermes|workflow)/.test(content)) {
    errors.push(`Legacy package import found in documentation/tooling: ${relative}`);
  }

  if (/\/api\/hermes\/proxy/.test(content) && !file.endsWith("registry.json")) {
    errors.push(`Generic Hermes proxy detected: ${relative}`);
  }
}

for (const required of [
  "hermes-server",
  "hermes-api",
  "hermes-query",
  "hermes-control-plane",
  "hermes-command-center",
  "hermes-dashboard-page",
]) {
  if (!names.has(required)) errors.push(`Full Hermes registry must expose ${required}.`);
}

if (names.has("supabase-next")) {
  errors.push("Application backend/auth foundations must not be part of the Hermes registry.");
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(
  `Registry OK: ${names.size} active items, full control plane restored, Hermes 0.6 unified URL/key connection enforced.`,
);
