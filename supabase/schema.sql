-- Empire Air & Heating — lead-response demo schema.
-- Paste into the Supabase SQL editor and run. Safe to re-run.

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),

  name        text not null,
  phone       text not null,
  email       text,
  -- Service id from config/company.ts (e.g. 'ac-repair'). Text, not an enum:
  -- the whole point is that a client can change their service list in the
  -- config without a database migration.
  service     text,
  urgency     text,
  message     text,

  -- 'form' | 'missed_call'
  source      text not null default 'form',
  -- 'new' | 'contacted' | 'follow_up_sent' | 'closed'
  status      text not null default 'new',

  -- Set the first time the owner responds (or an automation responds for them).
  -- time-to-first-response = first_response_at - created_at. This single column
  -- is what the dashboard's headline stat is built on.
  first_response_at timestamptz,

  -- Gemini's drafted reply. Null until generated; never blocks lead creation.
  ai_draft    text,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx     on public.leads (status);
-- The follow-up cron scans exactly this: leads still 'new', oldest first.
create index if not exists leads_followup_idx   on public.leads (status, created_at);

-- ---------------------------------------------------------------------------
-- messages — every email/SMS we sent or attempted.
-- Doubles as the demo's proof: the owner watches these appear in real time.
-- Mocked SMS and real SMS write identical rows, so the dashboard can't tell
-- the difference and neither can the audience.
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads (id) on delete cascade,

  -- 'sms' | 'email'
  channel   text not null,
  -- 'lead_confirmation' | 'owner_alert' | 'missed_call_textback' | 'follow_up'
  kind      text not null,
  recipient text not null,
  body      text not null,

  -- 'sent' | 'simulated' | 'failed'
  -- 'simulated' means no Twilio/SMTP credentials were configured. It is an
  -- honest status, not a fake success — the dashboard labels it as such.
  status    text not null default 'sent',
  error     text,

  created_at timestamptz not null default now()
);

create index if not exists messages_lead_id_idx    on public.messages (lead_id);
create index if not exists messages_created_at_idx on public.messages (created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_touch_updated_at on public.leads;
create trigger leads_touch_updated_at
  before update on public.leads
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- owners — the allowlist of people who may read leads.
--
-- Being logged in is NOT enough. An earlier version of this schema used
-- `to authenticated using (true)`, which sounds restrictive but isn't: Supabase
-- allows public self-signup with the anon key, and the anon key ships in the
-- browser bundle by design. Anyone could have registered an account and read
-- every customer's name, phone and email.
--
-- Now a session only counts if its email is listed here. Add the owner's email
-- below (and still turn OFF public signups in the Supabase dashboard —
-- Authentication -> Sign In / Providers -> "Allow new users to sign up").
-- ---------------------------------------------------------------------------
create table if not exists public.owners (
  email text primary key
);

alter table public.owners enable row level security;
-- No policies on `owners` at all: nothing but the service role can read or
-- write it. The policies below query it internally, which RLS permits.

-- >>> CHANGE THIS to the email you'll log into the dashboard with. <<<
-- It must match the user you create in Authentication -> Users, or you'll log
-- in and see zero leads. To change it later, just run:
--   delete from public.owners where email = 'CHANGE_ME@example.com';
--   insert into public.owners (email) values ('your@email.com');
insert into public.owners (email)
values ('CHANGE_ME@example.com')
on conflict (email) do nothing;

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Deny by default. The public website never talks to Supabase directly — it
-- POSTs to our own API routes, which use the service role key server-side and
-- bypass RLS entirely. So `anon` needs no policies at all, and a leaked anon
-- key grants nothing.
-- ---------------------------------------------------------------------------
alter table public.leads    enable row level security;
alter table public.messages enable row level security;

create or replace function public.is_owner()
returns boolean
language sql
security definer
set search_path = ''   -- pinned: an empty search_path stops a hijacked schema
stable                 -- from resolving `owners` to an attacker's table
as $$
  select exists (
    select 1
    from public.owners
    where email = (select auth.jwt() ->> 'email')
  );
$$;

drop policy if exists "authenticated can read leads" on public.leads;
drop policy if exists "owner can read leads" on public.leads;
create policy "owner can read leads"
  on public.leads for select
  to authenticated
  using (public.is_owner());

drop policy if exists "authenticated can update leads" on public.leads;
drop policy if exists "owner can update leads" on public.leads;
create policy "owner can update leads"
  on public.leads for update
  to authenticated
  using (public.is_owner())
  with check (public.is_owner());

drop policy if exists "authenticated can read messages" on public.messages;
drop policy if exists "owner can read messages" on public.messages;
create policy "owner can read messages"
  on public.messages for select
  to authenticated
  using (public.is_owner());
