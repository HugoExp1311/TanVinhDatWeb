# Công ty TNHH Tân Vĩnh Đạt — Website Giới thiệu

Vietnamese branding/introduce website for **Tân Vĩnh Đạt** — industrial waste collection, transportation, and treatment company.

## Stack

- **Next.js 15** (App Router, TypeScript, standalone server output)
- **React 19** + **Tailwind CSS** (brand palette: industrial blue `#0F4C75` + eco green `#16A34A` + accent gold)
- **Inter** font (Vietnamese subset via `next/font/google`)
- **Node.js 20** (Alpine) multi-stage Docker image, non-root `node` user
- **Caddy 2** TLS ingress + **Redis** for distributed rate limits / OCR concurrency
- **Google Maps embed** (no API key required)

## Pages (14 routes)

| Route | Description |
|---|---|
| `/` | Trang chủ (Hero, stats, services, why us, projects preview, certifications) |
| `/about` | Giới thiệu (story, mission/vision/values, stats) |
| `/services` | Dịch vụ (index + 3 detail pages: collection, transport, treatment) |
| `/projects` | Dự án tiêu biểu (6 project cards) |
| `/certifications` | Chứng nhận ISO/regulatory |
| `/process` | Quy trình 7 bước |
| `/faq` | Hỏi đáp (6-item accordion) |
| `/pricing` | Bảng giá tham khảo (3 category tables) |
| `/careers` | Tuyển dụng (5 job listings) |
| `/contact` | Liên hệ, form yêu cầu tư vấn/báo giá + Google Maps embed |
| `/policies` | Chính sách & Điều khoản |
| `/admin/login` | Đăng nhập admin nội bộ |
| `/admin/weight-tickets` | Admin tool OCR phiếu cân xe qua n8n webhook |
| `/sitemap.xml`, `/robots.txt` | SEO auto-generated |
| `/not-found` | Custom 404 |

## Local Development

```bash
npm install
npm run dev          # Dev server at http://localhost:3000
```

## Admin OCR Tool

The website includes a secure server-side admin panel for extracting weight ticket data from images through n8n.

Admin routes:

```text
/admin/login
/admin/weight-tickets
```

The tool supports:

- Upload one or multiple image files (`JPG`, `JPEG`, `PNG`).
- Input a public Google Drive image URL.
- Send images to a protected server API route, which proxies to the private n8n webhook.
- Output to Google Sheets or Excel, depending on the n8n workflow.
- Display the JSON result returned by n8n.

Security behavior:

- Admin login is handled by `POST /api/admin/login`.
- Password verification happens only on the server (PBKDF2 via `ADMIN_PASSWORD_HASH`).
- Authenticated admin sessions are signed (HMAC) and stored in an `HttpOnly` cookie.
- `/admin/*` pages are protected by Next.js middleware; APIs re-check session and role.
- OCR goes through `POST /api/admin/weight-tickets` only. Server validates MIME, magic bytes (JPEG/PNG), size (≤10MB/file, ≤10 files), request `Content-Length`, rate limits, and concurrency, then proxies to server-only `N8N_WEBHOOK_URL` (optional `N8N_WEBHOOK_SECRET`).
- Public contact form posts to `POST /api/contact`, which proxies to server-only `CONTACT_WEBHOOK_URL` (optional `CONTACT_WEBHOOK_SECRET`). There is no browser-exposed contact webhook URL.

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Then set at least:

```env
ADMIN_PASSWORD_HASH=pbkdf2:sha256:310000:...
ADMIN_SESSION_SECRET=replace-with-at-least-32-random-characters
ADMIN_ROLE=owner
ADMIN_SESSION_MAX_AGE_SECONDS=28800
REDIS_URL=redis://127.0.0.1:6379
TRUST_PROXY=false
TRUSTED_PROXY_HEADER=x-real-ip
SITE_ADDRESS=https://tanvinhdat.vn
N8N_WEBHOOK_URL=https://your-n8n-domain/webhook/img-extract
N8N_WEBHOOK_SECRET=
GOOGLE_SHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
CONTACT_WEBHOOK_URL=https://your-n8n-domain/webhook/contact-inquiry
CONTACT_WEBHOOK_SECRET=
```

Generate the admin password hash:

```bash
npm run admin:hash -- "your-strong-admin-password"
```

Copy the generated `ADMIN_PASSWORD_HASH=...` value into `.env.local` or your deployment environment.

Generate a strong session secret:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

> Security note: never put admin passwords, session secrets, or n8n webhook URLs in `NEXT_PUBLIC_*` variables. Those values are bundled into client JavaScript. Use the server-only names in `.env.example`.

## Production Build

```bash
npm run build        # Generates standalone Next.js server output
npm run start        # Starts the Next.js server
```

## Docker

Production Compose topology: **Caddy** (host `80`/`443`) → **web** (Next standalone on `3000`, not published) + **redis**.

```bash
# Requires SITE_ADDRESS and app secrets in the environment or a `.env` file
docker compose up --build -d

docker compose ps
docker compose logs -f caddy web redis
docker compose down
```

Image notes:
- Stage 1: `node:20-alpine` builds Next.js standalone output
- Stage 2: `node:20-alpine` runs `node server.js` as **`USER node`** (non-root)
- Compose injects `REDIS_URL=redis://redis:6379`, `TRUST_PROXY=true`, `TRUSTED_PROXY_HEADER=x-real-ip`
- Caddy terminates TLS for `SITE_ADDRESS` and sets `X-Real-IP` for trusted client IP rate limiting

Operator prerequisites:
- Real DNS for `SITE_ADDRESS` and open ports 80/443 (Caddy obtains certificates)
- `N8N_WEBHOOK_URL` / `CONTACT_WEBHOOK_URL` must be reachable **from the `web` container** and use **HTTPS in production** (enforced in app code). Do not point them at `http://localhost:...` inside Compose unless n8n truly shares that network namespace
- Caddy body limits (decimal units): `/api/contact` **33KB**, other routes (including OCR) **106MB**. App authoritative caps remain lower and exact: contact **32,768** bytes (`32 KiB`); OCR **105,906,176** bytes (`10 × 10 MiB + 1 MiB`). Caddy values are ingress headroom only so the proxy does not reject under the app limits.

## Project Structure

```
.
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Vietnamese, Inter, SEO)
│   ├── page.tsx                  # Home
│   ├── globals.css               # Tailwind + design tokens
│   ├── sitemap.ts, robots.ts     # SEO
│   ├── not-found.tsx             # 404
│   ├── about/, services/, projects/, certifications/,
│   ├── process/, faq/, pricing/, careers/, contact/, policies/
├── components/                   # Header, Footer, PageHero, ServiceCard,
│                                 # ServiceIcon, FAQAccordion, CTASection
├── lib/site.ts                   # Central site config (company info, content)
├── Dockerfile                    # Multi-stage builder + non-root Node runner
├── docker-compose.yml            # caddy + web + redis
├── Caddyfile                     # TLS reverse proxy → web:3000
├── middleware.ts                 # Protects /admin/* routes with signed cookie auth
├── nginx.conf                    # Legacy static Nginx config (not used by current Docker path)
├── next.config.mjs               # standalone output + security headers
├── tailwind.config.ts            # Custom brand palette + animations
└── tsconfig.json
```

## Customization

All copy is centralized in `lib/site.ts`. To replace placeholder content:

| Field | What to update |
|---|---|
| `site.name`, `site.shortName`, `site.tagline`, `site.description` | Company info |
| `site.email`, `site.phone`, `site.hotline`, `site.address` | Contact details |
| `site.mapEmbed` | Replace with real Google Maps embed URL |
| `site.social.*` | Social media profile URLs |
| `site.services` | Service categories, bullets, icons |
| `site.projects` | Project showcase entries |
| `site.certifications` | ISO / regulatory badges |
| `site.faqs` | FAQ items |
| `site.pricing` | Pricing tiers |
| `site.process` | Process steps |
| `site.jobs` | Career listings |

## Contact Inquiry Form

The contact page form validates input in the browser, then `POST`s JSON to **`/api/contact`**.

- Server rate-limits by client IP (Redis in production; see `TRUST_PROXY` / `TRUSTED_PROXY_HEADER`).
- Server forwards to **`CONTACT_WEBHOOK_URL`** with optional **`CONTACT_WEBHOOK_SECRET`** (`Authorization: Bearer …`).
- If the webhook is not configured, the API returns `503` with `CONTACT_WEBHOOK_NOT_CONFIGURED` and the client can fall back to a prefilled `mailto:` to `site.email`.
- Expected JSON fields include visitor contact data, service interest, waste type, volume/frequency, timeline, message, plus server-added `source` and `submittedAt`.

Do **not** configure `NEXT_PUBLIC_CONTACT_WEBHOOK_URL` — that variable is obsolete and must not appear in client bundles.

> **Note:** Marketing images may still use Unsplash URLs with `unoptimized`. For production branding, prefer self-hosted assets.

## SEO

- `<html lang="vi">` set in root layout
- Per-page metadata (title, description, OG tags)
- Auto-generated `sitemap.xml` and `robots.txt`
- Semantic HTML with proper heading hierarchy
- Vietnamese content throughout

## License

© Công ty TNHH Tân Vĩnh Đạt. All rights reserved.
