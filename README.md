# Công ty TNHH Tân Vĩnh Đạt — Website Giới thiệu

Vietnamese branding/introduce website for **Tân Vĩnh Đạt** — industrial waste collection, transportation, and treatment company.

## Stack

- **Next.js 14** (App Router, TypeScript, standalone server output)
- **Tailwind CSS** (custom brand palette: industrial blue `#0F4C75` + eco green `#16A34A` + accent gold)
- **Inter** font (Vietnamese subset via `next/font/google`)
- **Node.js 20** (Alpine) for secure server-side API routes in Docker
- **Google Maps embed** (no API key required)

## Pages (12 routes)

| Route | Description |
|---|---|
| `/` | Trang chủ (Hero, stats, services, why us, projects preview, certifications) |
| `/about` | Giới thiệu (story, mission/vision/values, stats) |
| `/services` | Dịch vụ (index + 3 detail pages: collection, transport, treatment) |
| `/projects` | Dự án tiêu biểu (6 project cards) |
| `/certifications` | Chứng nhận ISO/regulatory |
| `/process` | Quy trình 7 bước |
| `/faq` | Tuyển dụng/FAQ (jobs + accordion) |
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
- Password verification happens only on the server.
- Passwords are stored as PBKDF2 hashes via `ADMIN_PASSWORD_HASH`.
- Authenticated admin sessions are signed and stored in an `HttpOnly` cookie.
- `/admin/*` pages are protected by Next.js middleware.
- The n8n webhook URL is configured as server-only `N8N_WEBHOOK_URL` and is never exposed in browser JavaScript.
- The OCR proxy endpoint `/api/admin/weight-tickets` requires a valid admin session and role.

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Then update:

```env
ADMIN_PASSWORD_HASH=pbkdf2:sha256:310000:...
ADMIN_SESSION_SECRET=replace-with-at-least-32-random-characters
ADMIN_ROLE=owner
ADMIN_SESSION_MAX_AGE_SECONDS=28800
N8N_WEBHOOK_URL=http://localhost:5678/webhook/img-extract
N8N_WEBHOOK_SECRET=
GOOGLE_SHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
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

> Security note: do not use `NEXT_PUBLIC_*` variables for admin passwords, webhook URLs, or other secrets. `NEXT_PUBLIC_*` values are bundled into client-side JavaScript.

## Production Build

```bash
npm run build        # Generates standalone Next.js server output
npm run start        # Starts the Next.js server
```

## Docker

```bash
# Build & start
docker compose up --build -d

# Check status
docker compose ps

# View logs
docker compose logs -f web

# Stop
docker compose down
```

The image is multi-stage:
- Stage 1: `node:20-alpine` builds Next.js standalone output
- Stage 2: `node:20-alpine` runs `server.js` with private server-side environment variables

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
├── Dockerfile                    # Multi-stage: builder + Node.js runner
├── docker-compose.yml            # Single web service
├── middleware.ts                 # Protects /admin/* routes with signed cookie auth
├── nginx.conf                    # Legacy static Nginx config, not used by current Dockerfile
├── next.config.mjs               # `output: 'standalone'` for server deployment
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

The contact page includes a smart service inquiry / quote request form for public visitors.

By default, the public contact form can work without storing data on the website server and falls back to opening a prefilled email to `site.email`.

To submit form data directly to an automation workflow, configure a public webhook endpoint:

```env
NEXT_PUBLIC_CONTACT_WEBHOOK_URL=https://your-n8n-domain/webhook/contact-inquiry
```

Expected JSON payload includes visitor contact fields, service interest, waste type, estimated volume/frequency, timeline, message, `source`, and `submittedAt`.

> Because this is a `NEXT_PUBLIC_*` value in a static site, the webhook URL is visible in the browser bundle. Use spam protection, validation, and rate limiting in the receiving workflow for production.

> **Note:** All images use Unsplash URLs with `unoptimized` prop to keep image handling simple. For production, download and host images locally.

## SEO

- `<html lang="vi">` set in root layout
- Per-page metadata (title, description, OG tags)
- Auto-generated `sitemap.xml` and `robots.txt`
- Semantic HTML with proper heading hierarchy
- Vietnamese content throughout

## License

© Công ty TNHH Tân Vĩnh Đạt. All rights reserved.
