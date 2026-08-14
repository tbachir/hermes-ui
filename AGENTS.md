# Hermes UI Registry — Agent Instructions

This repository contains reusable **Hermes-facing** UI/BFF bricks. It is not a fork of Hermes, not an application backend, and not a place to invent replacement Hermes domain models.

## Hard boundaries

- `@burner-io/hermes` owns Hermes-native contracts/transports.
- `@burner-io/workflow` owns app-side orchestration.
- The consuming application owns authentication, authorization, backend/data, public API and product/domain concepts.
- Hermes remains private infrastructure; browsers must not receive Hermes credentials or communicate directly with Hermes.
- Never introduce `NEXT_PUBLIC_HERMES_*` credentials.
- Never introduce a generic `/api/hermes/proxy`.

## One Hermes connection

Installable items use only:

```dotenv
HERMES_URL=
HERMES_API_KEY=
```

`@burner-io/hermes` may expose different client facades/namespaces for native control operations and Runs/API resources. That does **not** justify separate application URLs or credentials. Every facade must resolve through the same private `HERMES_URL` and the same `HERMES_API_KEY` Bearer credential.

Do not reintroduce a second Dashboard-specific connection model.

## Preserve the control plane

The registry intentionally includes the complete reusable Hermes operator UI: command/status, profiles, Runs, sessions, Kanban, skills, MCP, tools, models/providers/credentials, automation, observability, developer operations, learning/memory, communication and system controls.

Do not remove a UI family merely because one introspection endpoint does not enumerate it. Handle genuine runtime/version unavailability explicitly in the relevant adapter/UI.

## Application access seam

`hermes-access` may depend on the consuming app's `@/lib/app-user` seam, but it must not own Better Auth, Payload, Supabase or another identity/backend stack. The reference template can implement that seam however it chooses.

## Registry promotion rule

Promote a change from the app template to this registry only when it is:

1. Hermes-specific;
2. reusable across applications;
3. faithful to Hermes-native concepts;
4. safe behind application-owned authorization;
5. independent from product/domain data.

## Workflow

Workflow definitions remain application-owned. A workflow may call native Hermes operations/Runs; Hermes must not learn a new `Workflow`, `Project`, `Spec` or other application concept because of the registry.

## Source ownership

shadcn items are copied into consuming applications. Keep them readable, explicit and easy to audit. Prefer bounded Route Handlers and typed SDK operations over hidden transport magic.
