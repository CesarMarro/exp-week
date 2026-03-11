# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CoopWork** — a hackathon project (USAC, March 2026) built in ~60 minutes. A platform where entrepreneurs with complementary skills (design, engineering, management) collaborate on projects with transparent equity distribution defined upfront.

Stack: **Next.js 16 · Supabase · TailwindCSS 4 · TypeScript**

## Commands

All commands run from the `coopwork/` subdirectory:

```bash
cd coopwork

npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

## Architecture

### App Router Structure

```
coopwork/
  app/
    page.tsx                    # Landing/hero page (implemented)
    layout.tsx                  # Root layout
    login/page.tsx              # Auth (email/password via Supabase)
    projects/
      page.tsx                  # Feed of open projects
      new/page.tsx              # Create project + define roles with equity %
      [id]/page.tsx             # Project detail + join role
    profile/page.tsx            # User profile
    api/
      projects/route.ts         # GET list / POST create
      projects/[id]/join/route.ts  # POST join a role

  lib/
    supabase.ts                 # Browser client (createBrowserClient)
    supabase-server.ts          # Server client (createServerClient) — to be created

  components/
    EquityBadge.tsx             # Pill showing equity % (implemented)
    Navbar.tsx                  # Top nav with login button (implemented)
    ProjectCard.tsx             # Project summary card — to be created
    RoleSlot.tsx                # Role display: name, %, filled/available — to be created

  middleware.ts                 # Protects /projects/new and /profile routes
```

### Database Schema (Supabase)

Three tables with RLS enabled:

- **profiles** — extends `auth.users`; auto-created via trigger on signup. Fields: `id`, `full_name`, `career`, `bio`, `avatar_url`
- **projects** — `id`, `title`, `description`, `owner_id`, `status` (`open`|`full`|`closed`), `created_at`
- **project_roles** — `id`, `project_id`, `role_name`, `equity_percent`, `filled_by` (null = available)

RLS policies: public read on all tables; authenticated users can create projects and fill roles; owners can insert roles.

### Key Business Logic

- **createProject()** — inserts into `projects` then batch-inserts `project_roles`. Equity percentages must sum to exactly 100%.
- **joinRole()** — UPDATE `project_roles.filled_by`; if all roles filled, set `projects.status = 'full'`.
- **getProjectWithRoles()** — join across projects + project_roles + profiles.

### Supabase Clients

- `lib/supabase.ts` exports `createClient()` using `createBrowserClient` — use in Client Components
- `lib/supabase-server.ts` should export a server client using `createServerClient` — use in Server Components and API routes

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
