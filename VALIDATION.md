# Validation

V0.4 is validated around the active installable registry, not around deprecated Dashboard-era source files that may remain unreferenced during migration.

## Required invariants

- active `hermes-server` uses only `HERMES_URL` and `HERMES_API_KEY`;
- no active item requires `HERMES_DASHBOARD_URL`, `HERMES_SESSION_TOKEN`, `HERMES_BEARER_TOKEN` or duplicate API Server URL/key variables;
- no `NEXT_PUBLIC_HERMES_*` credentials;
- no generic `/api/hermes/proxy`;
- active BFF routes use one `HermesApiServerApi` client;
- status reads `/health/detailed` + `/v1/capabilities` through the SDK;
- models use `/v1/models` + `/api/model/options`;
- skills/toolsets are read-only API Server resources;
- sessions use `/api/sessions/*`;
- Runs use `/v1/runs/*`;
- the application access guard is authentication-provider agnostic;
- workflow remains application-owned through `@burner-io/workflow`.

## Registry validation

```bash
npm run registry:check
npm run registry:build
```

The registry checker validates unique item names, same-repository dependencies, referenced source files and security invariants.

## Reference template

Compatibility is pinned in `templates/burner-hermes-app/template.json`. The current pin targets template commit `a7769bf1f93b63f9a523b2dc34748685b25a7997`, which already uses the same single API Server connection model.

## Migration note

Some old source files can remain in the repository while they are no longer referenced by any active registry item. They are not installed by `shadcn add`. A later cleanup can remove them from history-facing source directories without changing the V0.4 public catalog.
