import { runFollowUps } from "@/lib/follow-up";

/**
 * Scheduled follow-up sweep.
 *
 * Two callers in practice:
 *   - Vercel Cron (daily on the free plan — see vercel.json)
 *   - An external scheduler like cron-job.org, for the 2-minute demo cadence
 *     that Vercel's free tier can't do
 *
 * Both authenticate with CRON_SECRET as a bearer token. This endpoint mutates
 * data and sends email, so it is never left open.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  // Fail closed. An unset secret must not mean "no auth required" — that's how
  // a public endpoint that sends email ends up on the internet by accident.
  if (!secret) {
    console.error("[cron] CRON_SECRET is not set — refusing to run.");
    return Response.json({ error: "Not configured" }, { status: 503 });
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runFollowUps();
  console.log("[cron] follow-up sweep:", result);

  return Response.json(result);
}
