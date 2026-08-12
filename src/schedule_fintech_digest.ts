import { infrai } from "./fintech_digest_cron.ts";

const task = process.env.DIGEST_WEBHOOK_URL;

if (!task) {
  throw new Error("Set DIGEST_WEBHOOK_URL to the digest worker URL.");
}

new URL(task);

const job = await infrai.cron.create({
  cron_expr: "0 8 * * 1",
  task,
});

console.log(`Scheduled fintech digest: ${job.job_id}`);
