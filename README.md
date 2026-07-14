# HVAC Lead-Response Demo

A lead-response automation system for home-service businesses, built as a working demo.

HVAC companies lose jobs to response time, not to price. When someone's AC dies in July they
call three companies and book whoever answers first — so a lead that sits for an hour is
usually a lead that's already gone somewhere else.

This app answers every lead in seconds, chases the ones that go cold, and puts them all in one
place the owner can actually see.

**Demo company:** Empire Air & Heating, New York City. Fictional — every name, review, and
license number in here is invented.

---

## What it does

- **Instant response.** A form submission is saved and answered — email to the customer, alert
  to the owner — before the page finishes its animation.
- **Automatic follow-up.** A lead still untouched after a configurable delay gets chased
  automatically.
- **Missed-call text-back.** An unanswered call turns into an SMS and a new lead, instead of
  nothing.
- **Owner dashboard.** Every lead, its source, its status, and the time it took to respond.
- **AI reply drafts.** Each lead arrives with a personalized reply already written.

---

## Architecture

**One config file owns the brand.** [`src/config/company.ts`](src/config/company.ts) holds every
company-specific value — name, colors, phone, license, services, service area, reviews, copy.
Nothing company-specific is hardcoded in a component. Reskinning this for another company, or
another trade entirely, is a one-file edit. Colors flow from that config into CSS variables and
then into the Tailwind theme, so changing six hex values restyles the whole site.

**The lead is never lost.** `POST /api/leads` validates, saves, and *then* responds — sending
email afterwards via Next.js's `after()`, so the customer never waits on an SMTP handshake. If
the mail server is down, the lead is still saved and the customer still sees success. A dead
mail server is not allowed to become a lost customer.

**Secrets can't leak by accident.** The service-role Supabase client lives behind an
`import "server-only"` guard, so importing it from a client component fails the build rather
than shipping a key to the browser.

**Being logged in isn't enough.** Row-level security checks the session's email against an
`owners` allowlist. Supabase permits public signup with a key that ships in the browser bundle,
so "authenticated" on its own protects nothing.

---

## Stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) + TypeScript |
| Styling | Tailwind CSS v4 |
| Database & auth | Supabase (Postgres + RLS) |
| Email | Nodemailer over SMTP |
| AI | Google Gemini |
| Hosting | Vercel |

Every service is on a free tier. The whole thing runs without a credit card.

---

## Running it

```bash
npm install
cp .env.example .env.local   # then fill it in
npm run dev
```

**[SETUP.md](SETUP.md)** walks through creating the Supabase project, the Gmail app password,
and the Gemini key — about 20 minutes, click by click.

The marketing site renders with no environment variables at all; you only need them for the
lead pipeline.

---

## Notes

- **Vercel's free tier runs cron once per day**, so the 2-minute follow-up delay can't come from
  Vercel Cron. The endpoint ships as designed, and the dashboard has a "run now" button that
  triggers it on demand.
- **SMS is simulated by default.** Twilio's trial can't send custom message bodies and can't
  register for A2P 10DLC, so there's no free path to live text-back. The messaging layer is one
  interface with two drivers — real credentials swap in without a code change.
