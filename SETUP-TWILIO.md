# Twilio — going live with SMS

**You do not need this to demo the product.** With no Twilio credentials, SMS is simulated:
every message is written to the database and shown in the dashboard's message log, and the
"Simulate missed call" button runs the exact same code the real webhook does. Read this when a
client signs and wants real texts going out.

---

## Read this before you sign up

Twilio's free trial **cannot run this feature.** Two hard blocks:

1. **Trial accounts can't send custom message bodies.** You're limited to Twilio's predefined
   templates (order confirmations, appointment reminders). Our missed-call text is custom, so
   the trial simply won't send it.
2. **Trial accounts can't register for A2P 10DLC**, which US carriers require for any
   app-to-person SMS to a US number. Registration needs a paid account.

So going live means a paid account. There is no free path — which is exactly why the demo
mocks it.

**Real monthly cost, roughly:**

| | |
| --- | --- |
| Phone number | ~$1.15/mo |
| SMS | ~$0.008 each (~$8 per 1,000) |
| A2P 10DLC brand registration | ~$4 one-time |
| A2P 10DLC campaign | ~$10/mo |
| **Total** | **≈ $15/month** |

That's a cost you pass to the client once they've signed, not a cost of pitching.

---

## Setup

### 1. Account and number

1. Sign up at https://twilio.com and **upgrade to a paid account** (add ~$20 credit)
2. **Phone Numbers → Buy a number**
   - Country: United States
   - Capabilities: **Voice** and **SMS** both checked
   - A 212 / 718 / 917 area code suits a NYC demo
3. From the Console dashboard, copy your **Account SID** and **Auth Token**

### 2. A2P 10DLC registration — start this early

**Campaign review currently takes 10–15 days.** Begin it the day the client signs, or you'll be
waiting with nothing to show.

1. **Messaging → Regulatory Compliance → A2P Messaging**
2. Register the brand — the client's real business details: legal name, EIN, address, website
3. Create a campaign
   - Use case: **Customer Care** (this is service follow-up, not marketing)
   - Sample messages: paste the real ones from `src/lib/missed-call.ts`
   - Opt-in description: explain that customers receive texts after calling the business or
     submitting the website form
4. Attach the campaign to your phone number

> Be accurate here. Carriers reject vague or misleading registrations, and a rejection costs
> another two weeks.

### 3. Point the voice webhook at your app

1. **Phone Numbers → Manage → Active numbers →** click your number
2. Under **Voice Configuration**, "A call comes in":
   - Webhook: `https://YOUR-APP.vercel.app/api/twilio/voice`
   - Method: **HTTP POST**
3. Save

### 4. Environment variables

Add to `.env.local` (and to Vercel → Settings → Environment Variables):

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+12125550148     # your Twilio number, E.164
OWNER_PHONE_NUMBER=+19175550199      # where owner alerts go
```

Redeploy. No code changes — `src/lib/sms.ts` switches from the mock driver to the real one
purely on the presence of these variables.

### 5. Verify it works

- Dashboard → **Simulate missed call** → the message log should now show `SENT` instead of
  `SIMULATED`, and a real text should arrive
- Call the Twilio number from a phone → it rings the owner's number → hang up without
  answering → the caller gets the text-back and a lead appears

---

## How it works

**Missed call:** Twilio POSTs to `/api/twilio/voice` → we answer with TwiML that dials the
owner for 15 seconds → if unanswered, Twilio comes back with a `DialCallStatus` → we create a
lead with `source="missed_call"`, text the caller back, and alert the owner by SMS and email.

**Repeat callers:** the same number calling within 15 minutes merges into the existing lead
instead of creating duplicates, and the owner isn't alerted twice.

**Form submissions** also send a confirmation text, alongside the confirmation email.

---

## Security

The webhook validates Twilio's `X-Twilio-Signature` on every request (HMAC-SHA1 over the URL
plus sorted POST parameters, keyed with your auth token). Requests that fail validation get a
403.

This matters: without it, anyone who discovered the URL could forge missed calls — filling the
lead table and triggering real texts to numbers of their choosing, billed to the client.

The signature is computed over the **public** URL. Behind Vercel's proxy the route reads
`x-forwarded-host` to reconstruct it; if you deploy somewhere that sets a different header,
that logic in `src/app/api/twilio/voice/route.ts` needs adjusting or validation will fail.

---

## Troubleshooting

**Every webhook returns 403** — `TWILIO_AUTH_TOKEN` is wrong, or the reconstructed URL doesn't
match what Twilio signed. Check that the webhook URL in the Twilio console matches your
deployed URL exactly (https, no trailing slash).

**Texts fail with error 21608** — that's a trial account sending to an unverified number. It
means you haven't upgraded. The app logs this specifically and keeps going rather than
crashing.

**Texts fail with error 30034** — the number isn't registered for A2P 10DLC, or the campaign
hasn't been approved yet.

**Calls ring forever** — `OWNER_PHONE_NUMBER` is missing or not in E.164 format (`+1...`).
Without it every call is treated as missed, which is a safe default but not what you want.
