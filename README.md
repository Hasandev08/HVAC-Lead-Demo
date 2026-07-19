# HVAC Lead-Response Demo

A lead-response system for home-service businesses. Every enquiry — web form or missed call —
gets answered in seconds, chased automatically if it goes cold, and lands in one dashboard the
owner can actually use.

Built as a working demo for pitching NYC HVAC companies. The demo company, **Empire Air &
Heating**, is fictional; every name, review, and license number in here is invented.

**Stack:** Next.js 16 · TypeScript · Tailwind v4 · Supabase · Nodemailer · Google Gemini

---

## The problem it solves

HVAC companies lose jobs to response time, not price. When someone's AC dies in July they call
three companies and book whoever answers first. But the owner is on a roof at 2pm — he misses
the call, never sees the form submission, and the job goes to whoever picked up.

This closes that gap without the owner changing how he works.

---

## How it works

### A customer fills out the form

```
Form submitted
      ↓  (~200ms — the response returns before any email is sent)
Thank-you screen appears
      ↓  everything below runs after the response, in parallel
├─ Lead saved to the database
├─ Confirmation email to the customer
├─ Alert email to the owner  ("🔴 URGENT lead — call them")
├─ Confirmation SMS to the customer
└─ AI drafts a reply for the owner to review
```

The customer never waits on an SMTP handshake. Next.js's `after()` runs the slow work once the
response is already on its way.

**If any of it fails, the lead is still saved.** A dead mail server can't turn a captured lead
into a lost one — that's the single outcome the product exists to prevent.

### Nobody responds

```
Lead sits at status "New" for longer than FOLLOW_UP_DELAY_MINUTES
      ↓
Automatic follow-up email to the customer
      ↓
Lead flips to "Follow-up sent"  — never chased twice
```

Runs on a schedule (Vercel Cron), or on demand from the dashboard. Idempotent by construction:
selection is `status = 'new'`, and a successful send moves the lead off it.

### A call is missed

```
Customer calls → Twilio rings the owner's phone → no answer after 15s
      ↓
├─ Lead created  (source: missed_call)
├─ Text back to the caller  ("Sorry we missed you!")
└─ Owner alerted by SMS + email
```

Repeat callers within 15 minutes merge into the existing lead rather than creating duplicates,
and the owner isn't alerted twice.

### The owner's dashboard

Every lead in one table — source, status, and **time-to-first-response**. Four stats across the
top: total, this week, average response time, missed calls recovered. Status updates inline,
AI drafts expand with a copy button, and a message log shows every email and text the system
sent on his behalf.

---

## Architecture

### One config file owns the brand

[`src/config/company.ts`](src/config/company.ts) holds every company-specific value — name,
colors, phone, license, services, service area, reviews, and section copy. Nothing
company-specific lives in a component. Colors flow from that file into CSS variables and then
into the Tailwind theme, so changing six hex values restyles the whole site.

This was **verified, not assumed**: the config was retargeted to a fictional roofing company in
Dallas — different trade, city, palette, services, copy — and the site rendered correctly with
zero component changes. That test found five hardcoded strings that had leaked into components;
all were fixed.

*Known limit:* the icon set is HVAC-shaped (snowflake, furnace, boiler), so a different trade
needs new SVGs in `Icons.tsx`. That's the one part of a reskin that isn't a config edit.

### The lead is never lost

`POST /api/leads` validates, saves, then responds — and only afterwards sends email and SMS via
`after()`. Every send swallows its own errors and records the outcome to a `messages` table.

### Secrets can't leak by accident

The service-role Supabase client lives in its own module behind `import "server-only"`. If a
client component ever imports it, **the build fails** rather than shipping a module that
references the key to the browser.

### Being logged in isn't enough

Supabase allows public signup with a key that ships in the browser bundle, so "has a session"
proves nothing. Row-level security checks the session's email against an `owners` allowlist, and
the same check runs again in the page. Verified by attack: a self-registered account signs in
successfully and sees **zero leads**.

### Defence in depth on the dashboard

Three layers, because the Next.js auth guide is explicit that proxy is not a security boundary:

| Layer | Job |
| --- | --- |
| `src/proxy.ts` | Optimistic redirect at the edge |
| `requireOwner()` in the page | The real authorization check |
| Postgres RLS | The database's own check |

A valid session whose email isn't on the allowlist is rejected at every layer.

---

## Running it locally

```bash
npm install
cp .env.example .env.local   # then fill in — see below
npm run dev
```

The marketing site renders with **no environment variables at all**. You only need them for the
lead pipeline.

### 1. Supabase — database and auth

1. Create a project at [supabase.com](https://supabase.com) (free tier)
2. **SQL Editor → New query** → paste all of [`supabase/schema.sql`](supabase/schema.sql)
3. **Before running it**, change `CHANGE_ME@example.com` to the email you'll log in with
4. Run it
5. **Authentication → Sign In / Providers →** turn **OFF** "Allow new users to sign up"
6. **Authentication → Users → Add user** — same email as step 3, auto-confirm on
7. **Project Settings → API** — copy the Project URL, `anon` key, and `service_role` key

> Step 5 matters. Public signup plus a browser-visible anon key means anyone could create an
> account. RLS still blocks them from reading leads, but there's no reason to leave the door open.

### 2. Email — any SMTP server

Gmail is the fastest free option (500/day):

1. Enable 2-Step Verification on the Google account
2. Create an [App Password](https://myaccount.google.com/apppasswords)
3. Use that 16-character password — not your real one

Brevo, Mailtrap, or a custom domain drop in with no code change.

### 3. Google Gemini — AI drafts

Grab a key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey). Free tier,
no card. If it's missing, drafts fall back to a template and nothing breaks.

### 4. Fill in `.env.local`

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your16charapppassword
MAIL_FROM_NAME=Empire Air & Heating
MAIL_FROM_EMAIL=you@gmail.com
OWNER_ALERT_EMAIL=you@gmail.com     # where owner alerts land

# AI
GEMINI_API_KEY=

# Follow-up
FOLLOW_UP_DELAY_MINUTES=2           # 1440 (24h) in the real world
CRON_SECRET=                        # openssl rand -hex 32

# Twilio — leave blank; SMS is simulated without it
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
OWNER_PHONE_NUMBER=
```

Restart the dev server after editing — Next.js only reads env on boot.

### 5. Check it works

Submit the form with your own email, then confirm:

- Thank-you appears instantly
- Two emails arrive (customer confirmation + owner alert)
- The lead appears at `/dashboard` with an AI draft
- Supabase → Table Editor → `leads` has the row

---

## Deploying

Push to GitHub, import at [vercel.com/new](https://vercel.com/new), and paste the contents of
`.env.local` into the Environment Variables field. Vercel detects Next.js automatically.

`vercel.json` schedules the follow-up sweep daily — the most Vercel's free plan allows. For a
true 2-minute cadence, point a free scheduler like [cron-job.org](https://cron-job.org) at
`/api/cron/follow-up` with an `Authorization: Bearer <CRON_SECRET>` header.

> Vercel's Hobby plan prohibits commercial use. A paying client needs Pro ($20/mo).

---

## Going live with SMS

**SMS is simulated by default** — messages are recorded and shown in the dashboard's message
log, labelled `SIMULATED` rather than passed off as delivered. The "Simulate missed call" button
runs the same handler the real webhook does, so the demo exercises production code.

**Twilio's free trial cannot run this feature.** Trial accounts can't send custom message bodies
and can't register for A2P 10DLC, which US carriers require. Going live needs a paid account:

| | |
| --- | --- |
| Phone number | ~$1.15/mo |
| SMS | ~$0.008 each |
| A2P 10DLC brand + campaign | ~$4 once, then ~$10/mo |
| **Total** | **≈ $15/month** |

### Setup, when a client signs

1. Upgrade to a paid Twilio account, buy a number with **Voice + SMS**
2. **Messaging → Regulatory Compliance → A2P Messaging** — register the brand and campaign.
   Use case: *Customer Care*. **Review takes 10–15 days, so start immediately.**
3. **Phone Numbers → your number → Voice Configuration** → set "A call comes in" to
   `https://YOUR-APP.vercel.app/api/twilio/voice`, method **POST**
4. Add the four `TWILIO_*` variables and redeploy

No code changes — `src/lib/sms.ts` switches from the mock driver to the real one based purely on
whether those variables exist.

The client **keeps their existing number**: either forward it to the Twilio number, or port it
across. Their customers dial the same number as always.

### Webhook security

`/api/twilio/voice` validates Twilio's `X-Twilio-Signature` on every request (HMAC-SHA1 over the
URL plus sorted POST parameters, timing-safe compare). Requests that fail get a 403.

Without it the endpoint is forgeable: anyone with the URL could fake missed calls, filling the
lead table and triggering real texts to numbers of their choosing — on the client's bill.

The signature is computed over the **public HTTPS URL**, reconstructed from `x-forwarded-host`.
If you deploy somewhere that sets a different header, that logic needs adjusting.

### Common Twilio errors

| Code | Meaning |
| --- | --- |
| 21608 | Trial account texting an unverified number — you haven't upgraded |
| 30034 | Number isn't A2P 10DLC registered, or the campaign isn't approved yet |
| 403 from the webhook | Wrong auth token, or the reconstructed URL doesn't match |

---

## Project structure

```
src/
  config/company.ts        ← all company content lives here
  app/
    page.tsx               marketing site
    login/                 auth (server actions)
    dashboard/             owner dashboard + loading skeleton
    api/leads/             lead intake
    api/cron/follow-up/    scheduled chase, CRON_SECRET protected
    api/twilio/voice/      incoming-call webhook
  components/
    site/                  landing page sections
    dashboard/             stats, table, message log, AI draft
  lib/
    leads.ts               types, validation, phone helpers
    email.ts               SMTP + templates
    sms.ts                 sendSms(): Twilio or mock
    missed-call.ts         shared by webhook and simulate button
    follow-up.ts           the chase logic
    ai.ts                  Gemini drafts, with template fallback
    supabase-admin.ts      service role, server-only
    supabase-server.ts     cookie-based auth + owner check
  proxy.ts                 route guard (Next 16's renamed middleware)
supabase/schema.sql        tables, indexes, RLS policies
```

---

## Notes and limitations

- **`gemini-flash-latest` is a thinking model.** Thinking tokens count against
  `maxOutputTokens`, so `thinkingConfig: { thinkingBudget: 0 }` in `ai.ts` is load-bearing —
  without it, ~191 of 200 tokens go to internal reasoning and every draft is truncated
  mid-sentence. Don't remove it.
- **Rate limiting is in-memory**, so it's per-instance and best-effort. Fine for a demo; real
  traffic should move it to Redis or a WAF.
- **Supabase free projects pause after 7 days idle.** Wake it before any demo.
- **AI drafts are suggestions, never auto-sent.** A human reviews every one — which is also what
  makes it safe to feed a stranger's form text into a prompt.
- **Icons are HVAC-specific.** See the reskin note above.
