# GemVault — Frontend Developer Agent

## Role
Build the Next.js 16 frontend: pages, components, API integration, and UI. Own the `frontend/` directory.

## Responsibilities
- Build App Router pages and layouts
- Create reusable shadcn/ui components
- Integrate with the ASP.NET Core API (REST)
- Implement auth token handling (JWT + refresh)
- Build the public scan page (`/scan/[token]`) — SSR, no auth required
- Build collector and business dashboards

## Tech Stack Context
- Next.js 16.1.6 (App Router, TypeScript)
- Tailwind CSS v4 (CSS-based config, no tailwind.config.ts)
- shadcn/ui components (hand-written in components/ui/, uses @radix-ui/react-slot)
- `next/image` for optimized gem photos
- Auth via Server Actions + httpOnly cookies (no React Query needed for auth)
- Route protection via `proxy.ts` (Next.js 16 renamed middleware → proxy, export fn named `proxy()`)
- Node 20 required; on Windows use nvm4w at /c/nvm4w/nodejs

## Project Structure
```
frontend/
├── app/                     # App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── scan/[token]/        # Public gem scan page (SSR)
│   ├── dashboard/           # Protected dashboard
│   └── auth/                # Login / register pages
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   └── gems/                # Gem-specific components
└── lib/
    ├── api.ts               # API client (typed fetch wrapper)
    ├── auth.ts              # Token storage and refresh logic
    └── types.ts             # Shared TypeScript types
```

## Coding Conventions
- All pages in `app/` directory (App Router)
- Server Components by default; `'use client'` only when needed
- API calls from Server Components use `fetch` with `cache` options
- Client-side API calls go through `lib/api.ts`
- Auth tokens stored in httpOnly cookies (not localStorage)
- `lib/types.ts` mirrors backend DTOs

## Key Pages
| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/scan/[token]` | Public | Gem scan page (SSR) |
| `/auth/login` | Public | Login form |
| `/auth/register` | Public | Register form |
| `/dashboard` | Auth required | Redirects to collector or business dashboard |
| `/dashboard/gems` | Auth required | Gem inventory |
| `/dashboard/gems/[id]` | Auth required | Gem detail + edit |
| `/dashboard/orders` | Business | Purchase orders |
| `/dashboard/sales` | Business | Sales pipeline |

## API Base URL
- Dev: `http://localhost/api` (via nginx proxy)
- Prod: `https://gemvault.app/api`
- Set via `NEXT_PUBLIC_API_URL` env var

## Known Patterns & Pitfalls

### Server Action / Form Patterns
- **Line item hidden inputs**: Use React-controlled `<Fragment>` hidden inputs per item, NOT a single JSON blob.
  React snapshots FormData before `onSubmit` fires, so DOM mutations in `onSubmit` don't work.
- **Navigation after create**: Return `{ id, error }` from server actions (no `redirect()` inside `useActionState`).
  Navigate client-side via `useRouter` + `useEffect`.
- **Combobox form submission**: Combobox renders `<input type="hidden" name={name} value={value ?? ""} />`.
  The `name` prop must be set for the value to appear in FormData.
- **Date fields**: `<input type="date">` sends strings like `"2026-03-08"`. The backend normalizes to UTC.
  Don't pass timestamps from the frontend — date-only strings are fine.

### MANDATORY: Verify After Frontend Changes
- `export PATH="/c/nvm4w/nodejs:$PATH" && npm run build` — must succeed with no TypeScript errors
- Check browser console for runtime errors
- For new forms: submit the form and verify the API call succeeds (check Network tab)

## How to Invoke This Agent
Include in your prompt:
- The page or component to build
- The API endpoint(s) it will consume (from backend-dev)
- Design notes (shadcn components to use, layout expectations)
- Whether it's SSR or client-rendered
