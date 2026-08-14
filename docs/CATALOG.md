# Hermes UI Catalog

The catalog mirrors reusable **Hermes-native operator surfaces**. It does not mirror application-domain concepts, and it does not require a second Hermes Dashboard connection.

## Foundation

| Item | Purpose |
|---|---|
| `hermes-server` | one private `HERMES_URL` + `HERMES_API_KEY`, exposed through SDK control/API facades |
| `hermes-access` | consuming-app authorization seam before Hermes |
| `hermes-api` | explicit protected Next.js BFF routes |
| `hermes-query` | typed browser facade and TanStack Query hooks |

## Focused components

| Area | Items |
|---|---|
| Runtime | `hermes-status-card`, `hermes-run-console`, `hermes-session-list` |
| Profiles / models | `hermes-profile-switcher`, `hermes-model-manager`, `hermes-provider-manager`, `hermes-credential-manager` |
| Capabilities | `hermes-skill-manager`, `hermes-mcp-manager`, `hermes-toolset-manager`, `hermes-plugin-manager` |
| Work | `hermes-kanban-board` |
| Automation | `hermes-cron-manager`, `hermes-webhook-manager` |
| State / learning | `hermes-memory-manager`, `hermes-learning-overview` |
| Observability | `hermes-analytics-overview`, `hermes-log-viewer` |
| Developer | `hermes-config-overview`, `hermes-env-manager`, `hermes-file-browser`, `hermes-git-status`, `hermes-operations-panel` |
| Communication | `hermes-messaging-manager`, `hermes-portal-card`, `hermes-audio-console` |
| System | `hermes-gateway-controls`, `hermes-update-card` |

## Composed blocks

| Item | Composition |
|---|---|
| `hermes-command-center` | status + profiles + Runs + sessions + Kanban |
| `hermes-capabilities-center` | skills + MCP + toolsets |
| `hermes-models-center` | profiles + model assignment + providers + credentials |
| `hermes-automation-center` | cron + webhooks |
| `hermes-observability-center` | analytics + sessions |
| `hermes-developer-center` | config + env metadata + files + Git + diagnostics + logs |
| `hermes-learning-center` | learning/Curator + memory |
| `hermes-communication-center` | messaging + Portal + audio |
| `hermes-system-center` | status + gateway + memory + plugins + updates |
| `hermes-control-plane` | complete tabbed Hermes administration surface |
| `hermes-stack` | full foundation + control-plane preset |

## Pages

- `hermes-dashboard-page` → `/hermes`
- `hermes-runs-page` → `/hermes/runs`
- `hermes-sessions-page` → `/hermes/sessions`
- `hermes-capabilities-page` → `/hermes/capabilities`
- `hermes-models-page` → `/hermes/models`
- `hermes-automations-page` → `/hermes/automations`
- `hermes-observability-page` → `/hermes/observability`
- `hermes-developer-page` → `/hermes/developer`
- `hermes-learning-page` → `/hermes/learning`
- `hermes-communication-page` → `/hermes/communication`
- `hermes-system-page` → `/hermes/system`
- `hermes-workflows-page` → `/hermes/workflows`

## Workflow

`hermes-workflow-builder` remains application-owned orchestration through `@burner-io/workflow`. Hermes receives native Run/tool operations, not a new application Workflow domain model.

## Connection semantics

The route families used by the catalog can be represented by different namespaces in `@burner-io/hermes`, but the registry treats them as one trusted Hermes connection:

```text
HERMES_URL + HERMES_API_KEY
             │
       ┌─────┴─────┐
       │           │
 control facade   API/Run facade
       │           │
       └─────┬─────┘
             ▼
           Hermes
```

Do not introduce a second host or credential merely because an SDK method belongs to another facade.

## Adding a surface

Before promoting a new item:

1. confirm the operation is genuinely Hermes-native;
2. reuse or extend the typed seam in `@burner-io/hermes` where appropriate;
3. route it through the same private Hermes origin/key;
4. expose a bounded BFF operation instead of a generic proxy;
5. keep product/domain concepts outside Hermes;
6. provide loading, error and unavailable states appropriate to the operation.
