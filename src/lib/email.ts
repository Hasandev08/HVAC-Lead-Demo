import nodemailer from "nodemailer";
import { company, serviceName, urgencyLabel } from "@/config/company";
import { formatUsPhone, toE164, type Lead } from "@/lib/leads";
import { logMessage } from "@/lib/messages";

/**
 * Email over plain SMTP (Gmail app password, Brevo, Mailtrap — anything).
 *
 * If SMTP isn't configured, we log the email to the console and record it as
 * 'simulated' rather than throwing. A missing mail credential must never cost
 * us a lead — the lead is already in the database by the time we get here.
 */

/**
 * `||`, not `??`, and that distinction is load-bearing.
 *
 * dotenv parses a blank line (`MAIL_FROM_EMAIL=`) as an empty string, not
 * undefined — and `??` only falls back on null/undefined. With `??`, leaving
 * that line blank (which is exactly how .env.example ships) silently made
 * isEmailConfigured false, so every email was quietly "simulated" and no
 * customer ever heard from us. `||` treats blank as absent, which is what an
 * unset env var means to a human.
 */
const host = process.env.SMTP_HOST || undefined;
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER || undefined;
const pass = process.env.SMTP_PASS || undefined;

const fromName = process.env.MAIL_FROM_NAME || company.name;
const fromEmail = process.env.MAIL_FROM_EMAIL || user;
const ownerEmail = process.env.OWNER_ALERT_EMAIL || undefined;

export const isEmailConfigured = Boolean(host && user && pass && fromEmail);

/**
 * One pooled transporter for the process, not one per email. Each lead sends
 * two emails; rebuilding the transport meant two full TCP+TLS+AUTH handshakes
 * to Gmail every time. Nodemailer reuses the connection when pooled.
 */
let cachedTransporter: nodemailer.Transporter | null = null;

function transporter(): nodemailer.Transporter {
  cachedTransporter ??= nodemailer.createTransport({
    host,
    port,
    // 465 is implicit TLS; 587 upgrades via STARTTLS.
    secure: port === 465,
    auth: { user, pass },
    pool: true,
  });
  return cachedTransporter;
}

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text: string;
  leadId: string | null;
  kind: "lead_confirmation" | "owner_alert" | "follow_up";
};

async function send({ to, subject, html, text, leadId, kind }: SendArgs) {
  if (!isEmailConfigured) {
    console.warn(
      `[email] SMTP not configured — simulating "${subject}" to ${to}. ` +
        `Set SMTP_USER / SMTP_PASS in .env.local to send for real.`,
    );
    await logMessage({
      leadId,
      channel: "email",
      kind,
      recipient: to,
      body: text,
      status: "simulated",
    });
    return;
  }

  try {
    await transporter().sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      text,
      html,
    });
    await logMessage({
      leadId,
      channel: "email",
      kind,
      recipient: to,
      body: text,
      status: "sent",
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error(`[email] failed to send "${subject}" to ${to}: ${reason}`);
    await logMessage({
      leadId,
      channel: "email",
      kind,
      recipient: to,
      body: text,
      status: "failed",
      error: reason,
    });
  }
}

// --- Templates -------------------------------------------------------------
// Inline styles and table-free layout: email clients are not browsers, and
// anything fancier renders badly in Outlook and Gmail's mobile app.

function shell(headline: string, inner: string) {
  const { brand, accent } = company.colors;
  return `
<div style="margin:0;padding:24px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08);">
    <div style="background:${brand};padding:24px 28px;">
      <div style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-.2px;">
        ${company.logo.primary}<span style="color:${accent};"> ${company.logo.secondary}</span>
      </div>
    </div>
    <div style="padding:28px;">
      <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#0f172a;">${headline}</h1>
      ${inner}
    </div>
    <div style="padding:20px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.6;">
      ${company.name} &middot; ${company.address.street}, ${company.address.city}, ${company.address.state} ${company.address.zip}<br>
      ${company.license} &middot; ${company.phone.display}
    </div>
  </div>
</div>`.trim();
}

function button(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;background:${company.colors.accent};color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:8px;">${label}</a>`;
}

/** Sent to the customer the instant they submit. This is the "wow" moment. */
export async function sendLeadConfirmation(lead: Lead) {
  if (!lead.email) return;

  const firstName = lead.name.split(" ")[0];
  const service = lead.service ? serviceName(lead.service) : "your request";

  const text = `Hi ${firstName},

We've got your request for ${service} and we're on it.

Someone from our team will text you at ${formatUsPhone(lead.phone)} within the next few minutes to confirm your appointment window.

If it's an emergency and you'd rather talk right now, call us at ${company.phone.display} — we answer 24/7.

— The ${company.name} team
${company.license}`;

  const html = shell(
    `Got your request, ${escapeHtml(firstName)} — help is on the way.`,
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">
       We've received your request for <strong>${service}</strong> and we're on it.
     </p>
     <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#334155;">
       Someone from our team will <strong>text you at ${formatUsPhone(lead.phone)}</strong>
       within the next few minutes to confirm your appointment window.
     </p>
     <div style="margin:0 0 22px;padding:14px 16px;background:#fff7ed;border-left:3px solid ${company.colors.accent};border-radius:6px;">
       <p style="margin:0;font-size:14px;line-height:1.6;color:#7c2d12;">
         Can't wait? We answer the phone 24/7 — including nights and weekends, with no overtime charge.
       </p>
     </div>
     ${button(`Call ${company.phone.display}`, `tel:${company.phone.href}`)}
     <p style="margin:24px 0 0;font-size:14px;color:#64748b;">— The ${company.name} team</p>`,
  );

  await send({
    to: lead.email,
    subject: `We got your request — ${company.name}`,
    html,
    text,
    leadId: lead.id,
    kind: "lead_confirmation",
  });
}

/** Sent to the owner. Written to be readable on a phone screen, in one glance. */
export async function sendOwnerAlert(lead: Lead) {
  if (!ownerEmail) {
    console.warn("[email] OWNER_ALERT_EMAIL not set — skipping owner alert.");
    return;
  }

  const service = lead.service ? serviceName(lead.service) : "Not specified";
  const urgency = lead.urgency ? urgencyLabel(lead.urgency) : "Not specified";
  const isUrgent = lead.urgency === "asap";
  const phone = formatUsPhone(lead.phone);
  // Phones are stored as bare 10 digits. Dial links need the country code, or
  // they fail from a soft-dialer or a phone roaming abroad.
  const dial = toE164(lead.phone) ?? lead.phone;

  const text = `NEW LEAD — ${lead.name}

Phone:   ${phone}
Email:   ${lead.email || "not provided"}
Service: ${service}
When:    ${urgency}
Source:  ${lead.source === "missed_call" ? "Missed call" : "Website form"}

Message:
${lead.message || "(none)"}

Call them back now: ${phone}`;

  const row = (label: string, value: string) =>
    `<tr>
       <td style="padding:8px 0;font-size:13px;color:#64748b;width:90px;vertical-align:top;">${label}</td>
       <td style="padding:8px 0;font-size:15px;color:#0f172a;font-weight:500;">${value}</td>
     </tr>`;

  const html = shell(
    `New lead: ${escapeHtml(lead.name)}`,
    `${
      isUrgent
        ? `<div style="margin:0 0 20px;padding:12px 16px;background:#fef2f2;border-left:3px solid #dc2626;border-radius:6px;">
             <p style="margin:0;font-size:14px;font-weight:600;color:#991b1b;">Marked as an emergency — call first.</p>
           </div>`
        : ""
    }
     <table style="width:100%;border-collapse:collapse;margin:0 0 20px;">
       ${row("Phone", `<a href="tel:${dial}" style="color:${company.colors.primary};text-decoration:none;">${phone}</a>`)}
       ${row("Email", lead.email ? escapeHtml(lead.email) : "<span style='color:#94a3b8;'>not provided</span>")}
       ${row("Service", service)}
       ${row("When", urgency)}
       ${row("Source", lead.source === "missed_call" ? "Missed call" : "Website form")}
     </table>
     ${
       lead.message
         ? `<div style="margin:0 0 22px;padding:14px 16px;background:#f8fafc;border-radius:8px;">
              <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:.4px;color:#94a3b8;">Their message</p>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#334155;">${escapeHtml(lead.message)}</p>
            </div>`
         : ""
     }
     ${button(`Call ${phone}`, `tel:${dial}`)}`,
  );

  await send({
    to: ownerEmail,
    subject: isUrgent
      ? `🔴 URGENT lead — ${lead.name} (${service})`
      : `New lead — ${lead.name} (${service})`,
    html,
    text,
    leadId: lead.id,
    kind: "owner_alert",
  });
}

/** Phase 3: the automatic nudge when a lead has gone unanswered. */
export async function sendFollowUp(lead: Lead) {
  if (!lead.email) return;

  const firstName = lead.name.split(" ")[0];
  const service = lead.service ? serviceName(lead.service) : "your request";

  const text = `Hi ${firstName},

Just circling back on your ${service} request — we don't want to leave you sitting in a hot apartment.

We still have openings today. Call us at ${company.phone.display} or reply to this email and we'll lock in a time that works.

— The ${company.name} team`;

  const html = shell(
    `Still need help with ${service.toLowerCase()}?`,
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">
       Hi ${escapeHtml(firstName)} — just circling back on your request. We don't want to
       leave you sitting in a hot apartment.
     </p>
     <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#334155;">
       We still have openings today. Give us a call and we'll lock in a time that works for you.
     </p>
     ${button(`Call ${company.phone.display}`, `tel:${company.phone.href}`)}
     <p style="margin:24px 0 0;font-size:14px;color:#64748b;">— The ${company.name} team</p>`,
  );

  await send({
    to: lead.email,
    subject: `Still need help, ${firstName}? — ${company.name}`,
    html,
    text,
    leadId: lead.id,
    kind: "follow_up",
  });
}

/** The customer's message goes into an HTML email — so it gets escaped. */
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\n/g, "<br>");
}
