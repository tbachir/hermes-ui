# Validation

The active registry is validated around two simultaneous invariants:

1. **full Hermes operator coverage is preserved**;
2. **all Hermes traffic uses one private URL/key pair**.

## Required invariants

- `hermes-server` requires only `HERMES_URL` and `HERMES_API_KEY`;
- both the control facade and API Server facade use `env.url` / `env.apiKey`;
- no active item introduces a separate Dashboard URL/session credential or duplicate API Server URL/key variable;
- no `NEXT_PUBLIC_HERMES_*` credentials;
- no generic `/api/hermes/proxy`;
- application authentication remains outside the registry through `@/lib/app-user`;
- the full `hermes-control-plane` and command/capability/model/automation/observability/developer/learning/communication/system blocks remain installable;
- focused components for profiles, Kanban, skills, MCP, tools, models, providers, credentials, cron, webhooks, memory, plugins, analytics, logs, developer resources, communication and system operations remain in the catalog;
- Runs remain native Hermes API Server Runs;
- workflow remains application-owned through `@burner-io/workflow`.

## Registry validation

```bash
npm run registry:check
npm run registry:build
```

The checker validates unique names, local dependencies, referenced source files, one-connection security invariants and presence of the complete control-plane roots.

## Reference template

Compatibility is pinned in `templates/burner-hermes-app/template.json`. The standalone template is the reference integration application; `hermes-ui` remains the reusable Hermes registry.

## Runtime validation

A consuming application should additionally test its actual Hermes proxy/runtime because individual Hermes operations can vary by version or installed plugin. Runtime absence should surface as an explicit unavailable/error state, not as a switch to a second Hermes credential model.
