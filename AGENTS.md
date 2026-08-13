# Hermes UI Registry — Agent Instructions

This repository is the reusable UI/application layer around `@burner-io/hermes`.
It is a shadcn GitHub source registry, not a fork of Hermes and not a place to
invent replacement Hermes domain models.

## Boundaries

- Preserve native Hermes concepts and raw field names when a component talks to
  Hermes (`Profile`, `Session`, Kanban `Task`, API Server `Run`, etc.).
- Application-only concepts belong in this registry or the consuming app, never
  in `@burner-io/hermes`.
- Browser components never receive Hermes credentials. Browser code talks only
  to narrow authenticated Next.js endpoints.
- Keep `HERMES_*` secrets server-only. Never introduce `NEXT_PUBLIC_HERMES_*`.
- Never expose Supabase secret/service-role keys to client components.

## Default target stack

- Next.js App Router, current Next.js 16 conventions (`proxy.ts`).
- React 19.
- Tailwind CSS 4.
- shadcn/ui on Radix primitives when AI Elements are involved.
- Supabase SSR for authentication and app-owned persistence.
- TanStack Query for browser-side Hermes server state.
- AI Elements for model-generated markdown and AI-specific UI.

## Registry layering

1. `foundation`: auth, server transport, access guards, API boundaries, hooks.
2. `components`: focused reusable Hermes surfaces.
3. `blocks`: composed production-oriented features.
4. `pages`: optional ready-made Next.js route compositions.
5. `workflow`: app-owned workflow editing/runtime integrations.

Prefer a small component plus a composed block over one giant registry item.
Every block must declare its dependencies through `registryDependencies`.
Same-repository dependencies must use the full `tbachir/hermes-ui/<item>`
address, not a bare item name.

## Quality gate

Before committing:

```bash
node scripts/check-registry.mjs
```

Also typecheck or at minimum parse every new TypeScript/TSX file and verify any
Hermes-facing code against the current `@burner-io/hermes` declarations. When the
shadcn CLI is available, use `shadcn view` / `--dry-run` before calling an item
stable.

## UI conventions

- Use shadcn primitives instead of raw controls where a primitive exists.
- Use AI Elements `MessageResponse` for Hermes/model generated markdown.
- Provide loading, empty and error states.
- Keep operational interfaces compact, accessible and dark-mode compatible.
- Do not put secrets, raw authorization headers, or privileged tokens into UI
  state, props, logs or browser storage.
