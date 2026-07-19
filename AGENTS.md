# Repository Guidelines

## Project Overview

Tân Vĩnh Đạt is a Vietnamese corporate and SEO website for an industrial-waste collection, transportation, and treatment company. It also contains an internal admin tool that sends weight-ticket images to a private n8n OCR workflow and returns Google Sheets or Excel output.

The active stack is Next.js 15 App Router, React 19, strict TypeScript, Tailwind CSS, Node.js 20, Redis-backed rate limits, and Caddy TLS ingress in Compose. There is no database or CMS; public content is stored in `lib/site.ts`.

## Architecture & Data Flow

### Public website

1. App Router pages under `app/` render mostly as Server Components.
2. Pages read company copy, navigation, services, projects, pricing, FAQs, jobs, and contact information from `lib/site.ts`.
3. Shared presentation lives in `components/`; interactive components use local React state and explicit `'use client'` boundaries.
4. `components/InquiryForm.tsx` validates inquiries in the browser, posts to server `POST /api/contact`, and may open a prefilled `mailto:` fallback when the contact webhook is not configured.

### Admin OCR workflow

```text
/admin/*
  -> middleware.ts verifies signed session cookie
  -> AdminGuard calls GET /api/admin/me
  -> WeightTicketExtractor posts multipart FormData
  -> POST /api/admin/weight-tickets re-verifies session and role
  -> server forwards request to private N8N_WEBHOOK_URL
  -> n8n produces Google Sheets data or an Excel response
```

Authentication is intentionally layered: middleware protects admin pages, while every sensitive API route verifies the session independently. Password verification is PBKDF2-based in `lib/server/adminPassword.ts`; sessions are HMAC-SHA256 signed in `lib/server/adminSession.ts`. Keep all `ADMIN_*`, `N8N_*`, `CONTACT_*`, and Redis/proxy values server-only.

## Key Directories

- `app/` — App Router pages, root layout, SEO routes, admin pages, and API route handlers.
- `app/api/admin/` — Login, logout, session status, and protected OCR proxy endpoints.
- `app/api/contact/` — Public inquiry proxy to server-only contact webhook.
- `components/` — Shared public UI and interactive forms.
- `components/admin/` — Admin login, client session guard, and weight-ticket UI.
- `lib/site.ts` — Single source of truth for public company content.
- `lib/adminAuth.ts` — Client-safe admin paths and `AdminRole` type.
- `lib/server/` — Server-only password/session crypto, client IP trusted-proxy helper, and Redis/memory rate limits.
- `scripts/` — Operational helpers; currently the admin password-hash generator.
- `.agent/doc/` — Internal design, operations, and security notes. `SecuritySolution.md` records the six SecuritySummary priorities; prefer current code and `.env.example` if notes disagree.
- `out/` — Legacy generated static output; not part of the active standalone deployment.

## Development Commands

```bash
npm install                         # Install/update dependencies locally
npm ci                              # Reproducible install from package-lock.json
npm run dev                         # Start development server on localhost:3000
npm run type-check                  # Run strict TypeScript checks
npm run lint                        # Run Next.js lint command
npm run build                       # Build standalone Next.js production output
npm run start                       # Start the production Next.js server
npm run admin:hash -- "password"    # Generate ADMIN_PASSWORD_HASH
```

Environment setup:

```bash
cp .env.example .env.local
```

Docker workflow:

```bash
docker compose up --build -d
docker compose ps
docker compose logs -f web
docker compose down
```

## Code Conventions & Common Patterns

- Use the `@/` alias for project-root imports, for example `@/lib/site` and `@/components/PageHero`.
- Keep TypeScript strict. Avoid `any`; define narrow unions such as `AdminRole` and `OutputType`.
- Use PascalCase for React components, `*Page` for page functions, `route.ts` for route handlers, and SCREAMING_SNAKE_CASE for shared path/constants.
- Prefer Server Components. Add `'use client'` only for browser APIs, event handlers, hooks, or local interactive state.
- State management is local `useState`/`useRef`; the only shared client context is the admin session context. Do not add a global state library without a concrete need.
- Centralize marketing content in `lib/site.ts`; do not duplicate company copy across page components.
- Reuse design utilities from `app/globals.css` and brand tokens from `tailwind.config.ts`: `container-x`, `section`, `card`, `eyebrow`, `btn-primary`, `btn-outline`, and `brand-*` colors.
- Keep user-facing labels, validation, and errors in Vietnamese.
- Public page pattern: export `Metadata`, render `PageHero`, use `section`/`container-x`, and finish with `CTASection` where appropriate.
- Dynamic service pages use `generateStaticParams`, `generateMetadata`, and `notFound()`.
- Client requests use `async`/`await`, check `response.ok`, tolerate non-JSON failures with `.catch(() => null)`, and redirect to login on `401`.
- API handlers return `NextResponse.json({ error }, { status })`, log with a scoped prefix such as `[admin-login]`, and must not expose secrets or raw internal diagnostics.
- Keep validation on both client and server for admin uploads. Server validation is authoritative.
- Reuse paths from `lib/adminAuth.ts`; do not scatter literal admin URLs.
- Preserve the security boundary: never import `lib/server/*` into Client Components and never expose private admin/n8n values through `NEXT_PUBLIC_*`.

## Important Files

- `app/layout.tsx` — Global HTML shell, Inter font, metadata, header, and footer.
- `app/page.tsx` — Public homepage entry point.
- `app/globals.css` — Tailwind layers and reusable design utilities.
- `lib/site.ts` — Public content and company configuration.
- `middleware.ts` — Signed-cookie gate for `/admin/*` pages.
- `lib/server/adminPassword.ts` — PBKDF2 admin password verification.
- `lib/server/adminSession.ts` — Signed session creation, verification, expiry, and role helpers.
- `app/api/admin/login/route.ts` — Login and cookie creation.
- `app/api/admin/weight-tickets/route.ts` — Protected upload validation and n8n proxy.
- `components/InquiryForm.tsx` — Public inquiry submission and email fallback.
- `components/admin/WeightTicketExtractor.tsx` — Admin OCR client workflow.
- `.env.example` — Environment-variable contract; never copy real secrets into documentation.
- `next.config.mjs` — Standalone output, trailing slashes, unoptimized images, and HTTP security headers.
- `Dockerfile` / `docker-compose.yml` / `Caddyfile` — Active production topology (Caddy → web, Redis).
- `README.md` — Current operational documentation.

`nginx.conf`, `script.js`, `out/`, and older `.agent/doc/` drafts may describe static/client-only approaches. They are not authoritative for the current Node standalone + Caddy runtime.

## Runtime/Tooling Preferences

- Use Node.js 20 for local and container parity.
- Use npm and preserve `package-lock.json`; Docker installs with `npm ci`.
- Supported production path: Next.js standalone `node server.js` on port 3000 behind **Caddy** (`80`/`443`). Compose does **not** publish host port 80 directly onto Node; `web` is internal `expose: "3000"`.
- Runner image uses **`USER node`** (non-root). `nginx.conf` is legacy and unused by the current Docker image.
- TypeScript targets ES2022 with bundler module resolution and no emitted output from `tsc`.
- Tailwind scans `app/**/*.{ts,tsx}` and `components/**/*.{ts,tsx}`. UI classes outside those paths may not be included in generated CSS without config changes.
- External images currently use `next/image` with optimization disabled.
- Server-only variables (see `.env.example`): `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, `ADMIN_ROLE`, `ADMIN_SESSION_MAX_AGE_SECONDS`, `REDIS_URL`, `TRUST_PROXY`, `TRUSTED_PROXY_HEADER`, `SITE_ADDRESS`, `N8N_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET`, `GOOGLE_SHEET_URL`, `CONTACT_WEBHOOK_URL`, `CONTACT_WEBHOOK_SECRET`.
- Do **not** use `NEXT_PUBLIC_CONTACT_WEBHOOK_URL` or any `NEXT_PUBLIC_*` name for webhooks/secrets. Contact and OCR webhooks are server-only.
- Do not hand-edit generated files such as `next-env.d.ts`, `.next/`, `out/`, or `tsconfig.tsbuildinfo`.

## Testing & QA

No automated unit, integration, end-to-end, or coverage framework is currently configured. There is no `npm test` script or test directory. `.github/workflows/ci.yml` runs type-check, the production build, and a non-pushing Docker build for pull requests and pushes to `main`, plus manual `workflow_dispatch` runs.

For every code change, run the relevant static checks:

```bash
npm run type-check
npm run lint
npm run build
```

`npm run lint` may require initial ESLint configuration because no repository ESLint config is currently present. Lint is not a required CI check; do not claim lint success unless the command completes non-interactively.

Smoke-test changed behavior rather than relying only on compilation:

- Public UI: open the affected route, including mobile navigation and responsive layouts.
- Dynamic services: verify valid slugs and the custom 404 for an invalid slug.
- Contact form: required-field errors, optional email validation, successful `POST /api/contact`, `mailto:` fallback when webhook is unset, rate-limit/`503` handling, and app body cap **32,768** bytes (Caddy contact ingress **33KB**) as applicable.
- Admin authentication: unauthenticated redirect, valid/invalid login, `/api/admin/me`, logout, and expired-session handling.
- OCR proxy: unauthorized `401`; JPG/PNG + magic-byte checks; 10 MB/file; ≤10 files; exclusive file-or-Drive; app request size limit **105,906,176** bytes (Caddy non-contact body max **106MB**); both output modes; concurrency/rate-limit behavior when exercised.
- Docker changes: build image, confirm Caddy/`web`/`redis` health, non-root user in `web`, and `/` through the TLS proxy when certificates/DNS allow.

When adding tests, choose behavior-focused coverage for the changed contract and add the required test script/config in the same change. No coverage threshold is currently documented.
