# Security

## Hermes secrets are server-only

Never expose any of the following as `NEXT_PUBLIC_*`:

- `HERMES_SESSION_TOKEN`
- `HERMES_BEARER_TOKEN`
- `HERMES_API_SERVER_KEY`

The browser talks to `/api/hermes/*`. Those routes talk to Hermes through
`@burner-io/hermes`.

## Supabase authentication

`requireHermesAccess()` uses `supabase.auth.getClaims()` and then applies
`HERMES_UI_ALLOWED_USER_IDS`.

An empty allow-list fails closed with HTTP 503.

`*` means every authenticated user can control the exposed Hermes endpoints and
must be an explicit choice.

## Do not use Supabase service credentials in the browser

The registry only needs:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Any future server-side secret key must remain server-only.

## Keep the route surface narrow

Do not replace `app/api/hermes/*` with a generic proxy unless the consuming app
has an explicit authorization model for every Hermes operation.

## Workflow

Workflow definitions are app data. If stored in Supabase later, every exposed
table must have RLS and ownership/organization policies.

## Mutation origin check

The provided POST/DELETE route handlers use `requireHermesMutationAccess()` in
addition to Supabase identity verification. Browser mutations carrying an
`Origin` header must be same-origin with the Next.js request URL. This is a
small defense-in-depth layer against cross-origin control-plane mutations; it
does not replace authentication or the explicit user allow-list.

## Credential forms

`hermes-credential-manager` can accept a provider API key entered by an authorized
user. The value is POSTed to the protected same-origin Next.js route and handed to
Hermes; the registry does not store it in React state after the dialog closes, does
not cache it in TanStack Query, and never returns the raw key from a GET route.
Production deployments must use HTTPS between the browser and the Next.js app.

Provider OAuth URLs are opened only from the explicit provider action response.
Do not auto-follow arbitrary URLs returned by generic Hermes endpoints elsewhere.

## Developer/operator surface defaults

The registry deliberately keeps several native Hermes capabilities narrower than
what `@burner-io/hermes` can do:

- config is reduced to a reviewed non-secret read-only subset;
- environment variables are redacted and `env.reveal()` has no browser route;
- managed files are list-only;
- Git is read-only and remote paths must match `HERMES_UI_GIT_ROOTS`;
- operations expose only `doctor` and `security-audit`;
- log reads are capped at 500 lines;
- messaging onboarding/pairing mutations remain server-only in V0.2.

A consuming application can add more routes, but each should be treated as a new
authorization boundary rather than widening a generic proxy.
