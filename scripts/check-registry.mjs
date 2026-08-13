import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = JSON.parse(fs.readFileSync(path.join(root, "registry.json"), "utf8"));
const errors = [];
const names = new Set();
const items = [];
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

const sourceFiles = [];
for (const directory of ["registry", "docs", "scripts"]) {
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

  if (/NEXT_PUBLIC_HERMES_(?:SESSION|BEARER|API_SERVER_KEY)/.test(content)) {
    errors.push(`Hermes secret exposed as NEXT_PUBLIC_* in ${path.relative(root, file)}`);
  }

  if (/SUPABASE_(?:SERVICE_ROLE|SECRET)_KEY/.test(content) && file.includes("registry/components")) {
    errors.push(`Supabase elevated key referenced by client component: ${path.relative(root, file)}`);
  }
  if (/@tbachir\/(?:hermes|workflow)/.test(content) && file.includes("registry/")) {
    errors.push(`Legacy package import found in registry source: ${path.relative(root, file)}`);
  }

  if (/\.env\.reveal\s*\(/.test(content)) {
    errors.push(`Environment secret reveal is not allowed in the default registry: ${path.relative(root, file)}`);
  }

  if (/\/api\/hermes\/proxy/.test(content) && !file.endsWith("registry.json")) {
    errors.push(`Generic Hermes proxy detected: ${path.relative(root, file)}`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Registry OK: ${names.size} unique items, local dependencies resolved, file targets valid.`);
