# Changelog

## 0.4.2 - 2026-08-14

- Upgraded installable Hermes foundations to `@burner-io/hermes ^0.6.0`.
- Replaced manual construction of control/API clients with the SDK-level `createHermesConnectionUnchecked()` helper.
- Added `getHermesConnection()` as the canonical server-side source while keeping the existing control/API getters as compatibility aliases for installed BFF routes.
- Kept the complete Hermes control-plane catalog and the single `HERMES_URL` + `HERMES_API_KEY` application contract unchanged.

## 0.4.1 - 2026-08-14

- Restored the complete Hermes control-plane catalog after the V0.4 convergence had removed too many UI surfaces.
- Kept the simplified runtime contract: one `HERMES_URL` and one `HERMES_API_KEY`.
- Reintroduced the native control facade as an SDK convenience over the same URL/key rather than as a second Dashboard server connection.
- Restored profiles, Kanban, MCP, automation, providers/credentials, memory/learning, analytics/logs, developer, communication, gateway/plugins/updates and the full `hermes-control-plane` composition.
- Restored all specialized control-plane pages while preserving dedicated Runs and Sessions pages.
- Kept the registry application-auth/backend agnostic through `@/lib/app-user`.
- Strengthened registry validation so one Hermes URL/key is enforced without forbidding the full control facade.

## 0.4.0 - 2026-08-14

- Collapsed Hermes runtime configuration to `HERMES_URL` + `HERMES_API_KEY`.
- Removed application dependency on a separate Web Dashboard URL/session-auth configuration.
- Made the default application access guard auth-provider agnostic through `@/lib/app-user`.
- Added a versioned reference to the standalone `burner-hermes-app-template` without duplicating its private source into this public repository.

## 0.2.0 - 2026-08-13

- Initial public registry snapshot with the first Hermes control-plane catalog.
