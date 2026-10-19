-- prisma/rls.sql
--
-- Run in the Supabase SQL Editor (or psql) AFTER `prisma migrate dev`.
-- Idempotent: re-run it whenever you add a table (and add the table to the lists below).
-- Do NOT put this in prisma/migrations: Prisma's shadow database has no `auth` schema,
-- so `auth.uid()` would break `migrate dev`.
--
-- Layers:
--   1. Cross-user integrity triggers (a row can only reference a parent owned by the same user)
--   2. RLS + owner policies (protects the Data API / anon key; Prisma bypasses RLS)
--   3. Lock out the anon role completely
--   4. Clean up the profile when an auth user is deleted

-- ---------------------------------------------------------------------------
-- 1. Cross-user integrity
-- ---------------------------------------------------------------------------

create or replace function public.enforce_same_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  fk_value uuid;
  parent_owner uuid;
begin
  -- TG_ARGV[0] = parent table, TG_ARGV[1] = foreign key column on the child
  fk_value := nullif(to_jsonb(new) ->> TG_ARGV[1], '')::uuid;

  if fk_value is null then
    return new;
  end if;

  execute format('select "userId" from public.%I where id = $1', TG_ARGV[0])
    into parent_owner
    using fk_value;

  if parent_owner is distinct from new."userId" then
    raise exception 'cross-user reference blocked: %.% -> %',
      TG_TABLE_NAME, TG_ARGV[1], TG_ARGV[0]
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke execute on function public.enforce_same_owner() from public, anon, authenticated;

do $$
declare
  r record;
begin
  for r in
    select * from (values
      ('contacts',        'organizationId', 'organizations'),
      ('contact_methods', 'contactId',      'contacts'),
      ('interactions',    'contactId',      'contacts'),
      ('notes',           'contactId',      'contacts'),
      ('tasks',           'contactId',      'contacts'),
      ('important_dates', 'contactId',      'contacts'),
      ('contact_tags',    'contactId',      'contacts'),
      ('contact_tags',    'tagId',          'tags')
    ) as v(child, fk, parent)
  loop
    execute format('drop trigger if exists %I on public.%I',
      'same_owner_' || r.fk, r.child);
    execute format(
      'create trigger %I before insert or update on public.%I
         for each row execute function public.enforce_same_owner(%L, %L)',
      'same_owner_' || r.fk, r.child, r.parent, r.fk);
  end loop;
end
$$;

-- ---------------------------------------------------------------------------
-- 2. Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
drop policy if exists owner_all on public.profiles;
create policy owner_all on public.profiles
  for all to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

do $$
declare
  t text;
begin
  foreach t in array array[
    'organizations',
    'contacts',
    'contact_methods',
    'interactions',
    'notes',
    'tasks',
    'tags',
    'contact_tags',
    'important_dates'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists owner_all on public.%I', t);
    execute format(
      'create policy owner_all on public.%I
         for all to authenticated
         using ("userId" = (select auth.uid()))
         with check ("userId" = (select auth.uid()))',
      t);
  end loop;

  -- Prisma's migration table lives in public too. RLS on, no policies = no API access.
  if to_regclass('public._prisma_migrations') is not null then
    alter table public."_prisma_migrations" enable row level security;
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- 3. Lock out anon
-- ---------------------------------------------------------------------------

revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke all on sequences from anon;

-- ---------------------------------------------------------------------------
-- 4. Remove the profile (and everything cascading from it) when an auth user is deleted
--    Prisma can't model a foreign key to auth.users, so a trigger does the job.
-- ---------------------------------------------------------------------------

create or replace function public.handle_auth_user_deleted()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.profiles where id = old.id;
  return old;
end;
$$;

revoke execute on function public.handle_auth_user_deleted() from public, anon, authenticated;

drop trigger if exists on_auth_user_deleted on auth.users;
create trigger on_auth_user_deleted
  after delete on auth.users
  for each row execute function public.handle_auth_user_deleted();

-- ---------------------------------------------------------------------------
-- Verify: every table should show rowsecurity = true
-- ---------------------------------------------------------------------------

-- select tablename, rowsecurity from pg_tables where schemaname = 'public' order by 1;

-- ---------------------------------------------------------------------------
-- Test (run manually, uncomment all lines; everything rolls back)
--
-- Notes: Prisma generates ids and updatedAt in the client, so raw inserts must supply them.
-- Expected results are in the comments.
-- ---------------------------------------------------------------------------

-- begin;
--
-- insert into public.profiles (id, email) values
--   ('00000000-0000-0000-0000-00000000000a', 'a@test.dev'),
--   ('00000000-0000-0000-0000-00000000000b', 'b@test.dev');
--
-- insert into public.contacts (id, "userId", "firstName", "updatedAt")
-- values (gen_random_uuid(), '00000000-0000-0000-0000-00000000000a', 'Alice', now());
--
-- -- RLS: user B sees nothing of user A's contacts
-- set local role authenticated;
-- select set_config('request.jwt.claims',
--   '{"sub":"00000000-0000-0000-0000-00000000000b","role":"authenticated"}', true);
-- select count(*) from public.contacts;                -- expect 0
--
-- -- anon has no access at all
-- reset role;
-- set local role anon;
-- select count(*) from public.contacts;                -- expect: permission denied
-- reset role;
--
-- -- Integrity trigger: B cannot attach a note to A's contact
-- insert into public.notes (id, "userId", "contactId", body, "updatedAt")
-- select gen_random_uuid(), '00000000-0000-0000-0000-00000000000b', id, 'x', now()
-- from public.contacts;                                -- expect error 23514
--
-- rollback;