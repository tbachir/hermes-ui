# Hermes UI Registry — Agent Instructions

This repository contains reusable **Hermes-facing** UI/BFF bricks. It is not a fork of Hermes, not an application backend, and not a place to invent replacement Hermes domain models.

## Hard boundaries

- `@burner-io/hermes` owns Hermes-native contracts/transports.
- `@burner-io/workflow` owns app-side orchestration.
- The consuming application owns authentication, authorization, backend/data, public API and product/domain concepts.
- Hermes must remain private infrastructure; browsers must not receive Hermes credentials or communicate directly with Hermes.
- Never introduce `NEXT_PUBLIC_HERMES_*` credentials.
- Never introduce a generic `/api/hermes/proxy`.

## Hermes connection

The active registry uses one machine connection only:

```dotenv
HERMES_URL=
HERMES_API_KEY=
```

Do not reintroduce `HERMES_DASHBOARD_URL`, Dashboard session tokens, duplicate API Server URLs or Web Dashboard authentication into installable registry items.

The intended machine-facing contract is the Hermes API Server (`/v1/*`, selected `/api/*`, `/health/*`) under `API_SERVER_KEY` bearer authentication.

## API capability rule

Treat `/v1/capabilities` as the runtime source of truth for optional features. Do not silently fall back to private/Dashboard routes if the API Server does not advertise a capability.

## Application access seam

`hermes-access` may depend on the consuming app's `@/lib/app-user` seam, but it must not own Better Auth, Payload, Supabase or another identity/backend stack. The reference template can implement that seam however it chooses.

## Registry promotion rule

Promote a change from the app template to this registry only when it is:

1. Hermes-specific;
2. reusable across applications;
3. backed by an intended API Server contract;
4. safe behind application-owned authorization;
5. independent from product/domain data.

## Workflow

Workflow definitions remain application-owned. A workflow may call a native Hermes Run; Hermes must not learn a new `Workflow`, `Project`, `Spec` or other application concept because of the registry.

## Source ownership

shadcn items are copied into consuming applications. Keep them readable, explicit and easy to audit. Prefer bounded Route Handlers and typed SDK operations over hidden transport magic.
