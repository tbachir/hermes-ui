# Validation — 0.2.0

Validated on 2026-08-13.

## Passed

- Registry graph: **55 unique items**.
- Every declared source file exists.
- Same-repository `registryDependencies` resolve to known items.
- `registry:file` / `registry:page` declarations have explicit targets.
- Registry sources were staged into their actual install targets (`@components`,
  `@lib`, `@hooks`, and `~/app/...`) and typechecked as one consuming app.
- TypeScript validation uses `strict`, `exactOptionalPropertyTypes`, and
  `noUncheckedIndexedAccess` against the real local Hermes 0.5 and Workflow 0.1
  declaration bundles, mapped to the published `@burner-io/*` import names.
- Server route contracts compile against the native Hermes client namespaces.
- Security boundary checks include: no privileged Hermes `NEXT_PUBLIC_*` names,
  no browser secret reveal route, Git path fail-closed allow-listing, bounded log
  reads, and no generic Hermes proxy.

Framework/UI packages are represented by minimal type stubs in the isolated
contract test so the check can focus on registry composition and Hermes/Workflow
API compatibility without installing an entire Next.js application.

## shadcn CLI build note

The official `shadcn build` command cannot complete in this artifact container:
its system npm configuration contains an invalid `registry=https:///` entry and
outbound npm/DNS access is unavailable. The registry graph and installed-target
checks do not depend on npm access.

`hermes-ui` is primarily a GitHub source registry. After the repository is public,
run the external CLI smoke test:

```bash
pnpm dlx shadcn@latest list tbachir/hermes-ui
pnpm dlx shadcn@latest view tbachir/hermes-ui/hermes-control-plane
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-control-plane --dry-run
```
