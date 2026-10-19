# Personal CRM

A private, fast, self-owned CRM for remembering people and never missing a follow-up.

> **Status:** 🚧 In planning / early development. See [`CONTEXT.md`](./CONTEXT.md) for goals, architecture decisions, and the roadmap.

## Why

Most CRMs are built for sales teams. This one is built for _relationships_: who you know, what you last talked about, and who you should reach out to next.

## Features

### **MVP (in progress)**

- 🔐 Auth with Supabase (cookie sessions)
- 👤 Contacts with multiple emails, phones, and socials
- 🏢 Organizations
- 🕒 Interaction timeline (calls, meetings, messages)
- ✅ Tasks and follow-up reminders
- 📝 Notes per contact
- 🏷️ Tags
- 📊 Dashboard: who to reach out to, overdue tasks, recent activity
- 📤 CSV import / CSV and JSON export

### **Planned (post-MVP)**

- Contact cadence ("stay in touch every N days")
- Birthdays and important dates
- ⌘K command palette search

## Tech stack

| Layer            | Tool                              |
| ---------------- | --------------------------------- |
| Framework        | Next.js (App Router) + TypeScript |
| Auth and hosting | Supabase                          |
| Database         | PostgreSQL                        |
| ORM              | Prisma                            |
| Server state     | TanStack Query                    |
| UI state         | Zustand                           |
| Validation       | Zod                               |
| Forms            | React Hook Form                   |
| UI               | shadcn/ui + Tailwind CSS          |

## Getting started

### Prerequisites

- Node.js 20+
- pnpm
- A [Supabase](https://supabase.com) project

### 1. Install

```bash
git clone <your-repo-url>
cd personal-crm
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

| Variable                               | Description                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------ |
| `DATABASE_URL`                         | Supabase **pooler** connection string, transaction mode (port 6543). Used at runtime |
| `DIRECT_URL`                           | Supabase direct or session-mode pooler string (port 5432). Used by Prisma migrations |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project URL                                                                 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key (`sb_publishable_...`)                                      |
| `NEXT_PUBLIC_SITE_URL`                 | App URL, used for the magic-link redirect                                            |
| `ALLOW_SIGNUP`                         | `true` only while creating your own account, then `false`                            |

### 3. Set up the database

```bash
pnpm prisma migrate dev     # apply migrations
pnpm prisma generate        # generate the client
pnpm db:seed                # optional: sample data
```

Then apply the RLS policies (see [`prisma/rls.sql`](./prisma/rls.sql)) in the Supabase SQL editor.

### 4. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command              | Description              |
| -------------------- | ------------------------ |
| `pnpm dev`           | Start the dev server     |
| `pnpm build`         | Production build         |
| `pnpm start`         | Run the production build |
| `pnpm lint`          | ESLint                   |
| `pnpm typecheck`     | `tsc --noEmit`           |
| `pnpm test`          | Run tests                |
| `pnpm prisma studio` | Browse the database      |
| `pnpm db:seed`       | Seed sample data         |

## Project structure

```folder
src/
  app/
    (auth)/                  # login, callback
    (app)/                   # dashboard, contacts, organizations, tasks, settings
  features/
    contacts/                # components, actions, queries, schemas, hooks
    interactions/
    tasks/
    ...
  components/ui/             # shadcn components
  lib/
    prisma.ts                # singleton client
    auth.ts                  # requireUser()
    supabase/                # server + client helpers
prisma/
  schema.prisma
  rls.sql
```

## Architecture at a glance

```text
RHF + Zod (client) → Server Action (re-validates with same Zod)
                   → requireUser() → Prisma (scoped by userId) → PostgreSQL
                   → TanStack Query cache invalidation
```

- **Prisma is the only data-access path.** Supabase handles Auth and hosting.
- **Every query is scoped by `userId`.** Prisma bypasses RLS, so authorization is enforced in the app layer, with RLS as a second line of defense.
- **TanStack Query owns server data; Zustand owns UI state only.**

Full details and rationale are in [`CONTEXT.md`](./CONTEXT.md).

## Security

- All server entry points call `requireUser()`
- All queries include `where: { userId }`
- Inputs are validated server-side with Zod
- RLS enabled on all tables
- No secret/service-role key in the app; the publishable key is the only Supabase key it uses
- Disable public signup after creating your account

Found a security issue? Open a private report rather than a public issue.

## Roadmap

- [ ] **Phase 0**: Foundation (Next.js, Supabase, Prisma, auth, app shell)
- [ ] **Phase 1**: Contacts, detail page, log interaction, tags
- [ ] **Phase 2**: Tasks, notes, organizations, dashboard
- [ ] **Phase 3**: RLS tests, CSV import/export, polish, deploy

## Deployment

Designed for Vercel + Supabase.

1. Create a Vercel project from the repo
2. Add the environment variables above
3. Run `pnpm prisma migrate deploy` against the production database
4. Apply `prisma/rls.sql`
5. Disable public signups in Supabase Auth settings

## License

TBD (private project for now).
