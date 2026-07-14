# Setup — 20 minutes, $0, no credit card

Do these in order. Everything below is free.

---

## 1. Supabase (the database) — 8 min

**Create the project**

1. Go to https://supabase.com → **Sign up** (use GitHub, it's fastest)
2. **New project**
   - Name: `hvac-lead-demo`
   - Database password: click **Generate a password** and let the browser save it
   - Region: **East US (North Virginia)** — closest to NYC
3. Wait ~2 minutes while it provisions.

**Create the tables**

4. Left sidebar → **SQL Editor** → **New query**
5. Open `supabase/schema.sql` in this repo, copy **all** of it, paste it in
6. **Before you run it**, find this line near the bottom and put YOUR email in it:
   ```sql
   values ('owner@example.com')
   ```
   This is the email you'll log into the dashboard with. Only this email can see the leads.
7. Click **Run**. You should see "Success. No rows returned."

**Turn off public signups — do not skip this**

8. Left sidebar → **Authentication** → **Sign In / Providers**
9. Find **"Allow new users to sign up"** and turn it **OFF**

> Without this, anyone can create an account on your Supabase project. The database rules
> block them from reading leads, but leaving signup open is a door you don't need. Two locks
> beat one.

**Create your login**

10. **Authentication** → **Users** → **Add user** → **Create new user**
11. Email: the same email you put in the SQL above. Pick any password. **Auto-confirm: ON**

**Copy your keys**

12. **Project Settings** (gear icon) → **API keys**
13. You need three values — keep this tab open for step 4:
    - **Project URL** (looks like `https://abcdefgh.supabase.co`)
    - **anon public** key
    - **service_role** key (click to reveal — this one is secret)

---

## 2. Gmail (sending email) — 5 min

Gmail sends 500 emails/day free. You need an **App Password**, not your real password.

1. Go to https://myaccount.google.com/security
2. Turn on **2-Step Verification** if it isn't already (required — no way around it)
3. Go to https://myaccount.google.com/apppasswords
4. App name: type `HVAC Demo` → **Create**
5. Google shows a **16-character password** like `abcd efgh ijkl mnop`
6. **Copy it now** — Google never shows it again. Remove the spaces when you paste it.

---

## 3. Google Gemini (the AI drafts) — 2 min

1. Go to https://aistudio.google.com/apikey
2. **Create API key** → pick your Google account
3. Copy the key

Free tier. No billing setup, no card.

---

## 4. Put it all together — 3 min

In the project root, copy the template:

```bash
cp .env.example .env.local
```

Now open `.env.local` and fill it in:

```bash
# From Supabase step 12
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-anon-key
SUPABASE_SERVICE_ROLE_KEY=paste-service-role-key

# From Gmail step 6
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=abcdefghijklmnop        # the 16-char app password, no spaces
MAIL_FROM_NAME="Empire Air & Heating"
MAIL_FROM_EMAIL=your.email@gmail.com
OWNER_ALERT_EMAIL=your.email@gmail.com   # where "owner" alerts land — your inbox

# From Gemini step 3
GEMINI_API_KEY=paste-gemini-key

# Leave as-is
FOLLOW_UP_DELAY_MINUTES=2
CRON_SECRET=                      # run: openssl rand -hex 32
```

Generate the cron secret:

```bash
openssl rand -hex 32
```

Paste the output after `CRON_SECRET=`.

> **Don't leave `MAIL_FROM_EMAIL` blank.** A blank value used to silently switch email off
> entirely — the app would say "sent" and nothing would arrive. That's fixed now, but fill it
> in anyway.

---

## 5. Run it

```bash
npm run dev
```

Open http://localhost:3000, submit the form with your own email and phone, then check:

- ✅ Thank-you message appears instantly
- ✅ A confirmation email lands in your inbox
- ✅ An owner alert email lands too
- ✅ In Supabase → **Table Editor** → **leads**, the row is there

If all four happen, the pipeline works and you're ready for Phase 2 (the dashboard).

---

## Troubleshooting

**No email arrives**

- Check the terminal. `[email] SMTP not configured` means a blank value in `.env.local`.
- Gmail rejects the login → you used your real password, not the 16-char App Password.
- Restart `npm run dev` after editing `.env.local`. Next.js only reads it on boot.

**"Could not save your request"**

- The three Supabase values are wrong or the SQL never ran. Check **Table Editor** for a `leads` table.

**Supabase project is "paused"**

- Free projects sleep after 7 days idle. Open the dashboard and click **Restore**.
- ⚠️ **Wake it up before any client demo** — a sleeping database means the form fails in front of a prospect.
