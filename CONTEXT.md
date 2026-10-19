# CONTEXT.md

> Source of truth for **what this project is, why it exists, and the rules for building it.**
> Read this before writing code. Update it when a decision changes.
> Humans and AI coding agents both use this file.

**Working title:** Personal CRM (rename later)
**Status:** Phase 0 (Foundation) in progress
**Owner:** Gio (solo developer)
**Last updated:** 2026-10-19

---

## 1. Purpose

A **personal relationship manager**: a private tool to remember people, log interactions, and never miss a follow-up.

**Core job to be done:** "Who should I reach out to today, and what did we last talk about?"

This is a _relationship_ tool, not a sales pipeline.

## 2. Goals and non-goals

### Goals

- Single-user first, but **multi-user-safe by design** (every row has `userId`)
- Logging an interaction takes **under 10 seconds**
- Dashboard answers "who do I follow up with?" at a glance
- Own your data: CSV/JSON import and export from the start
- Simple, boring, maintainable architecture a solo dev can finish

### Non-goals (for MVP)

- Deals / sales pipeline / Kanban
- Email or calendar sync (OAuth + sync is the biggest scope risk)
- Team features, roles, sharing
- Attachments / file storage
- Mobile app or PWA
- Analytics and reporting

> **Rule:** Nothing from the non-goals list is built until the MVP has been used daily for 2 weeks.

## 3. Tech stack

| Layer           | Choice                                  | Role                                                                     |
| --------------- | --------------------------------------- | ------------------------------------------------------------------------ |
| Framework       | Next.js (App Router, TypeScript strict) | UI, Server Actions, route handlers                                       |
| Auth            | Supabase Auth (`@supabase/ssr`)         | Cookie sessions, magic link (OAuth later), session refresh in `proxy.ts` |
| Database        | Supabase-hosted PostgreSQL              | Primary datastore                                                        |
| ORM             | Prisma                                  | Schema, migrations, typed queries (server-side only)                     |
| Server state    | TanStack Query                          | Fetching, caching, mutations, optimistic updates                         |
| Client/UI state | Zustand                                 | Sidebar, filters, command palette only                                   |
| Validation      | Zod                                     | Single schema shared by client and server                                |
| Forms           | React Hook Form + `zodResolver`         | All forms                                                                |
| UI              | shadcn/ui + Tailwind                    | Components and styling                                                   |

## 4. Architecture decisions

| #   | Decision                                                                                                                       | Rationale                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| D1  | **Prisma is the only data-access path.** Supabase is used for Auth and hosting; don't query tables with the Supabase JS client | One path = one place to enforce authorization         |
| D2  | **Every query is scoped by `userId`.** Never fetch by `id` alone                                                               | Prevents IDOR; Prisma bypasses RLS                    |
| D3  | **RLS is enabled as defense in depth** (policies on `user_id = auth.uid()`)                                                    | Blocks access through the public anon key / PostgREST |
| D4  | **Zod schemas are shared**, live in `features/*/schemas`, and are re-parsed in every server action                             | Client validation is UX only                          |
| D5  | **TanStack Query owns server data; Zustand owns UI state.** Never cache server data in Zustand                                 | Avoids two sources of truth                           |
| D6  | **Soft delete contacts** (`archivedAt`); hard delete everything else                                                           | Safe undo for the main entity                         |
| D7  | **`lastContactedAt` is denormalized** and updated only inside the log-interaction transaction                                  | Cheap dashboard queries                               |
| D8  | Search starts with `pg_trgm` + `ILIKE`; no external search service                                                             | Personal scale doesn't need more                      |
| D9  | Feature-based folder structure                                                                                                 | Keeps related code together                           |

### Data flow

```text
RHF + Zod (client) → Server Action (re-validate with same Zod) → requireUser() → Prisma (scoped by userId) → Postgres
                                                                         ↓
                                              TanStack Query invalidation on success
```

### Connection setup

- `DATABASE_URL` → Supabase **pooler**, transaction mode (port 6543), used at runtime through the `@prisma/adapter-pg` driver adapter
- `DIRECT_URL` → direct or session-mode pooler connection (port 5432), read only by `prisma.config.ts` for migrations
- Prisma 7: generator `prisma-client`, client generated to `src/generated/prisma`, no `url` in `schema.prisma`
- Prisma client is a **singleton** (`lib/prisma.ts`)

## 5. Domain model (summary)

Full schema lives in `prisma/schema.prisma`. Conventions: UUID PKs, `userId` on every table, `createdAt` / `updatedAt`, indexes on `(userId, …)`.

| Entity               | Purpose                         | Key fields                                                                             |
| -------------------- | ------------------------------- | -------------------------------------------------------------------------------------- |
| `Profile`            | Mirrors `auth.users.id`         | `id`, `email`                                                                          |
| `Contact`            | A person                        | name, title, `organizationId?`, `contactEveryDays?`, `lastContactedAt?`, `archivedAt?` |
| `ContactMethod`      | Emails, phones, socials         | `type`, `value`, `label?`, `isPrimary`                                                 |
| `Organization`       | Company/group                   | `name` (unique per user), `website?`                                                   |
| `Interaction`        | Timeline entry                  | `type`, `occurredAt`, `summary`                                                        |
| `Note`               | Free-form note                  | `body`, `pinned`                                                                       |
| `Task`               | Follow-up                       | `title`, `dueAt?`, `status`, `contactId?`                                              |
| `Tag` / `ContactTag` | Labels                          | `name` (unique per user), `color?`                                                     |
| `ImportantDate`      | Birthdays, anniversaries (v1.1) | `label`, `month`, `day`, `year?`                                                       |

## 6. Modules and scope

**MVP:** Auth · Contacts · Organizations · Interactions timeline · Tasks · Notes · Tags · Dashboard · CSV import/export

**v1.1:** Contact cadence + overdue surfacing · Important dates · ⌘K search

**Later:** Deals/pipeline · Email/calendar sync · Attachments · PWA

## 7. Security rules (non-negotiable)

1. All server entry points call `requireUser()` first.
2. All Prisma queries include `where: { userId }`. No exceptions.
3. Validate input with Zod on the server, including UUID format for IDs.
4. Use `supabase.auth.getClaims()` on the server (it verifies the JWT signature). Never trust `getSession()` in server code.
5. `SUPABASE_SERVICE_ROLE_KEY` and DB URLs are server-only. Never prefix with `NEXT_PUBLIC_` and never import into client components.
6. Middleware protects routes but is **not** the only check.
7. RLS enabled on every table. Include a test proving user A cannot read user B's rows.
8. Disable public signup in Supabase after the owner account is created.
9. Backups enabled; export feature built before launch.

## 8. Conventions

- **Language/format:** TypeScript strict, ESLint, Prettier, no `any` without a comment
- **Naming:** `camelCase` for code, `PascalCase` for components/types, `kebab-case` for files and routes
- **Folder structure:**

  ```folder
  src/
    app/(auth)/…
    app/(app)/{dashboard,contacts,organizations,tasks,settings}/
    features/<feature>/{components,actions,queries,schemas,hooks}
    components/ui/          # shadcn
    lib/{prisma.ts, auth.ts, supabase/{server,client}.ts}
  prisma/schema.prisma
  ```

- **Server Actions** return a typed result: `{ ok: true, data } | { ok: false, error }`
- **Query keys** are defined per feature in `queries/keys.ts`
- **Env vars** are validated with Zod at startup
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`)

## 9. UX principles

- Fast capture beats complete data. "Log interaction" must be reachable in two clicks or fewer
- Optimistic updates for logging, completing tasks, and tagging
- Every list has an empty state, loading skeleton, and error state
- Keyboard-friendly; sidebar + top bar with quick-add

## 10. Roadmap and status

| Phase | Scope                                                     | Status         |
| ----- | --------------------------------------------------------- | -------------- |
| 0     | Foundation: Next.js, Supabase, Prisma, auth, app shell    | 🟨 In progress |
| 1     | Core loop: contacts, detail page, log interaction, tags   | ⬜             |
| 2     | Follow-up engine: tasks, notes, organizations, dashboard  | ⬜             |
| 3     | Hardening: RLS + tests, CSV import/export, polish, deploy | ⬜             |

**MVP definition of done:** real contacts imported, an interaction logged in under 10 seconds, and the dashboard shows who to follow up with today.

## 11. Known risks

| Risk                                   | Mitigation                                                                          |
| -------------------------------------- | ----------------------------------------------------------------------------------- |
| Scope creep into a Salesforce clone    | Non-goals list and the 2-week rule                                                  |
| IDOR because Prisma bypasses RLS       | Scoped data layer (D2) + cross-user test                                            |
| Stale `lastContactedAt`                | Update only inside the log-interaction transaction; recompute on interaction delete |
| State duplication (Query vs Zustand)   | Decision D5                                                                         |
| Pooler vs migration connection mix-ups | Separate `DATABASE_URL` / `DIRECT_URL`                                              |

## 12. Open questions

- [ ] Final project name
- [ ] Auth methods: magic link only, or Google too?
- [ ] Package manager: pnpm (assumed)
- [ ] Hosting: Vercel (assumed)
- [ ] Is a lightweight deals table needed for freelance leads, or are tasks enough?
