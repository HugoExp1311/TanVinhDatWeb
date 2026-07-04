# Công ty TNHH Tân Vĩnh Đạt — Website Giới thiệu

Vietnamese branding/introduce website for **Tân Vĩnh Đạt** — industrial waste collection, transportation, and treatment company.

## Stack

- **Next.js 14** (App Router, TypeScript, static export)
- **Tailwind CSS** (custom brand palette: industrial blue `#0F4C75` + eco green `#16A34A` + accent gold)
- **Inter** font (Vietnamese subset via `next/font/google`)
- **Nginx 1.27** (Alpine) for static file serving in Docker
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
| `/contact` | Liên hệ (info-only + Google Maps embed) |
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

The website includes a static-export compatible admin panel for extracting weight ticket data from images through n8n.

Admin routes:

```text
/admin/login
/admin/weight-tickets
```

The tool supports:

- Upload one or multiple image files (`JPG`, `JPEG`, `PNG`).
- Input a public Google Drive image URL.
- Send images to the configured n8n webhook.
- Output to Google Sheets or Excel, depending on the n8n workflow.
- Display the JSON result returned by n8n.

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Then update:

```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/img-extract
NEXT_PUBLIC_ADMIN_PASSWORD=change-this-admin-password
NEXT_PUBLIC_GOOGLE_SHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
```

> Security note: this admin panel uses a client-side `sessionStorage` guard so it can work with `output: 'export'`. This hides the tool from normal navigation, but it is not equivalent to server-side authentication. For public production security, use a server-side admin login and proxy the n8n webhook through a protected API route.

## Production Build

```bash
npm run build        # Generates static export to /out
npm run start        # (only works without `output: 'export'`)
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

The image is **multi-stage** (~30MB final size):
- Stage 1: `node:20-alpine` builds Next.js
- Stage 2: `nginx:1.27-alpine` serves the static `/out` folder

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
├── Dockerfile                    # Multi-stage: builder + nginx runner
├── docker-compose.yml            # Single web service
├── nginx.conf                    # Nginx config (gzip, security headers, cache)
├── next.config.mjs               # `output: 'export'` for static
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

> **Note:** All images use Unsplash URLs with `unoptimized` prop (required for static export). For production, download and host locally.

## SEO

- `<html lang="vi">` set in root layout
- Per-page metadata (title, description, OG tags)
- Auto-generated `sitemap.xml` and `robots.txt`
- Semantic HTML with proper heading hierarchy
- Vietnamese content throughout

## License

© Công ty TNHH Tân Vĩnh Đạt. All rights reserved.
