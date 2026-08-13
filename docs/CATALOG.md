# Hermes UI Catalog

The catalog mirrors **native Hermes surfaces**. A registry item may compose several
native surfaces, but it must not rename them into a parallel application domain.

## Coverage in V0.2

| Hermes namespace / protocol | UI item | Block | Browser exposure |
|---|---|---|---|
| `system` | `hermes-status-card` | `hermes-system-center` | read |
| `gateway` | `hermes-gateway-controls` | `hermes-system-center` | start/stop/restart |
| `updates` | `hermes-update-card` | `hermes-system-center` | check/apply |
| `profiles` | `hermes-profile-switcher` | `hermes-models-center` | read/set active |
| `models` | `hermes-model-manager` | `hermes-models-center` | read/set |
| `providers` | `hermes-provider-manager` | `hermes-models-center` | selected OAuth/custom actions |
| `credentials` | `hermes-credential-manager` | `hermes-models-center` | list/add/remove; raw key never returned |
| `skills` | `hermes-skill-manager` | `hermes-capabilities-center` | read/create/toggle |
| `mcp` | `hermes-mcp-manager` | `hermes-capabilities-center` | list/create/test/toggle/remove |
| `tools` | `hermes-toolset-manager` | `hermes-capabilities-center` | list/toggle/terminal backend |
| `plugins` | `hermes-plugin-manager` | `hermes-system-center` | list/rescan/enable/disable/update |
| `sessions` | `hermes-session-list` | `hermes-observability-center` | read |
| `analytics` | `hermes-analytics-overview` | `hermes-observability-center` | read |
| `logs` | `hermes-log-viewer` | `hermes-developer-center` | read, max 500 lines |
| `cron` | `hermes-cron-manager` | `hermes-automation-center` | list/create/pause/resume/trigger/delete |
| `webhooks` | `hermes-webhook-manager` | `hermes-automation-center` | selected lifecycle actions |
| `memory` | `hermes-memory-manager` | `hermes-learning-center` / system | read/select/reset |
| `config` | `hermes-config-overview` | `hermes-developer-center` | safe read-only subset |
| `env` | `hermes-env-manager` | `hermes-developer-center` | redacted list/set/delete; **no reveal** |
| `filesystem.managed` | `hermes-file-browser` | `hermes-developer-center` | read-only list |
| `git` | `hermes-git-status` | `hermes-developer-center` | read-only status/branches/worktrees + path allow-list |
| `operations` | `hermes-operations-panel` | `hermes-developer-center` | doctor/security-audit only |
| `learning` + `curator` | `hermes-learning-overview` | `hermes-learning-center` | graph + curator run/pause/resume |
| `messaging` + `pairing` | `hermes-messaging-manager` | `hermes-communication-center` | platforms/pairing + test/toggle |
| `portal` | `hermes-portal-card` | `hermes-communication-center` | read |
| `audio` | `hermes-audio-console` | `hermes-communication-center` | voices + TTS |
| Kanban plugin | `hermes-kanban-board` | `hermes-command-center` | read-only board in V0.2 |
| API Server Runs | `hermes-run-console` | `hermes-command-center` | create/status/stop/approval |

## Intentionally not exposed by the default registry

The Hermes SDK is broader than the browser control plane. V0.2 deliberately leaves
high-impact or complex operations server-only unless a consuming app adds a reviewed
route and policy. Examples include:

- raw config YAML read/write;
- environment secret reveal;
- raw filesystem write/delete/upload;
- Git stage/commit/push/PR/worktree mutations;
- operations backup/import/debug-share/hooks/checkpoint mutations;
- messaging onboarding and pairing mutations;
- audio transcription/streaming;
- arbitrary plugin/provider extension payloads;
- richer Kanban task mutation/detail workflows;
- session prune/import/export/bulk deletion.

This is a security boundary, not missing SDK coverage: `@burner-io/hermes` remains the
native server-side source of truth.
