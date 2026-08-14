# Changelog

## 0.4.0 - 2026-08-14

- Collapsed Hermes runtime configuration to `HERMES_URL` + `HERMES_API_KEY`.
- Removed Web Dashboard/session-auth concepts from the active installable registry.
- Rebuilt the server foundation around one `HermesApiServerApi` instance.
- Rebased status, models, skills, toolsets and sessions on the API Server machine contract.
- Reduced the active UI catalog to API Server-backed surfaces: health/capabilities, Runs, sessions, models, skills and toolsets.
- Made the default application access guard auth-provider agnostic through `@/lib/app-user`.
- Added Runs and Sessions pages and simplified the Hermes overview page.
- Rewrote architecture/security/catalog documentation around private server-to-server Hermes access.
- Added a versioned reference to the standalone `burner-hermes-app-template` without duplicating its private source into this public repository.

## 0.2.0 - 2026-08-13

- Initial public registry snapshot with the earlier Dashboard + API Server split.

> The unreleased/local V0.3 Payload/Better Auth experiment informed the app template, but application backend/auth choices are no longer part of the Hermes registry contract in V0.4.
