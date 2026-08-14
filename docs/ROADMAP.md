# Roadmap

The roadmap is intentionally limited to **Hermes-facing reusable bricks**. Payload CMS, Better Auth, public application APIs and product/domain workflows live in consuming applications and are demonstrated by the separate reference template.

## v0.4.1 — one connection, full control plane

- one private Hermes connection: `HERMES_URL` + `HERMES_API_KEY`;
- control and Runs/API SDK facades share that exact origin/key;
- complete control-plane registry restored;
- command/status, profiles, sessions, Runs and Kanban;
- skills, MCP and toolsets;
- models, providers and credentials;
- cron and webhooks;
- memory, learning/Curator;
- analytics and logs;
- safe config/env/files/Git/diagnostics surfaces;
- messaging, Portal and audio;
- gateway, plugins and updates;
- auth/backend-provider-agnostic application authorization seam;
- standalone reference-template compatibility pin.

## v0.5 — resilient capability/runtime UX

- explicit runtime capability/status model shared by components;
- unavailable/read-only/error states without deleting UI families;
- distinguish runtime version/plugin absence from authorization failures;
- richer diagnostics for route availability;
- preserve one connection even when a capability is unavailable;
- optional `/v1/capabilities` helpers for feature introspection.

## v0.6 — richer native Run/session UX

- SSE bridge for `/v1/runs/{run_id}/events`;
- live tool/subagent progress timeline;
- run steering;
- structured AI Elements renderers for tool/reasoning/checkpoint events;
- session create/update/delete/fork controls;
- session chat + streaming chat;
- reconnect/reconciliation UX driven by native Hermes state.

## v0.7 — SDK convergence

- rationalize the current `HermesRuntimeClient` / `HermesApiServerApi` split behind one ergonomic high-level connection factory;
- keep native namespaces intact while removing duplicated application configuration;
- typed availability/capability helpers;
- typed SSE consumption and cancellation;
- compatibility tests against current Hermes routes/proxy behavior.

## v0.8 — registry/template promotion loop

- automated compatibility check between `hermes-ui` and the pinned `burner-hermes-app-template` revision;
- controlled promotion of reusable Hermes-specific improvements from the app template back into the registry;
- registry diff tooling that preserves the single-connection contract and full control-plane catalog;
- optional template publication/embedding only when explicitly decided.

## Boundary

Every future addition must preserve:

```text
application policy
      ↓
reusable Hermes brick
      ↓
@burner-io/hermes
      ↓
HERMES_URL + HERMES_API_KEY
      ↓
private Hermes
```
