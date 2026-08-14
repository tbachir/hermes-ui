# Security

## Hermes is private infrastructure

The intended topology is:

```text
Browser / external client
        │
        ▼
Application backend / BFF
        │ private network + HERMES_API_KEY
        ▼
      HERMES_URL
        │
        ▼
       Hermes
```

Hermes is not a public application API. Prefer network isolation/firewall rules in addition to the machine credential.

## Server-only connection

The Hermes runtime contract is exactly:

```dotenv
HERMES_URL=
HERMES_API_KEY=
```

Never expose either value through `NEXT_PUBLIC_*`, client props, browser bundles, rendered diagnostics or logs.

The SDK may expose separate control and Run/API facades, but both are constructed from this same URL/key pair. A second URL or credential is not required by the registry architecture.

## Application authentication is separate

`hermes-ui` does not choose the consuming application's identity provider. Authenticate and authorize the caller before entering the Hermes BFF. The default `hermes-access` block uses the application-provided `@/lib/app-user` seam and optional role/user allow-lists.

Authentication to the product does not automatically imply permission to operate Hermes.

## Bounded BFF, never a generic proxy

The registry exposes a broad operator control plane, but every browser-facing capability remains an explicit reviewed route. Do not add an endpoint that forwards arbitrary Hermes method/path/body input.

Examples of explicitly bounded areas include:

- status and profiles;
- Runs and sessions;
- Kanban;
- skills, MCP and toolsets;
- models, providers and credentials;
- cron and webhooks;
- memory/learning;
- analytics/logs;
- config/env/file/Git developer surfaces;
- messaging, Portal and audio;
- gateway/plugins/updates.

Broad UI coverage does not mean arbitrary transport access.

## Sensitive operator surfaces

Some Hermes capabilities are inherently privileged. Keep the default restrictions unless the consuming application intentionally changes them:

- environment values are redacted; do not expose secret reveal operations;
- generic managed-file browsing remains read-only;
- Git access is constrained by `HERMES_UI_GIT_ROOTS`;
- diagnostic operations are explicitly allow-listed;
- credentials must never be returned in plaintext to browser code;
- mutating controls require application authorization and same-origin checks.

## Runtime/version differences

`/v1/capabilities` and normal HTTP error handling can be used to adapt UX across Hermes versions. A route unavailable on one runtime should become an explicit unavailable/error state, not trigger a fallback to a second public endpoint or a different credential model.

## CORS

The base architecture is server-to-server. Browser-to-Hermes CORS is not part of the normal trust model because the browser should not possess `HERMES_API_KEY` or network reachability to Hermes.

## Workflow

Workflow definitions and application approvals remain app-owned. A workflow Hermes node invokes the same private Hermes connection; it does not bypass application policy merely because Hermes can execute powerful tools internally.
