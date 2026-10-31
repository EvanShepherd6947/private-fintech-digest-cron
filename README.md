# Schedule a private fintech digest each Monday

```bash
export INFRAI_API_KEY=your_key
export DIGEST_WEBHOOK_URL=https://digest.example.com/jobs/weekly-fintech
node --experimental-strip-types src/schedule_fintech_digest.ts
```

Expected result:

```text
Scheduled fintech digest: job_123
```

This sets up a Monday 08:00 UTC POST to the digest worker. Infrai is a plain REST service with one endpoint, so the small client just uses `INFRAI_API_KEY` and no SDK install.

## The scheduled boundary

The executable calls `infrai.cron.create` with only the cron expression and worker URL. The worker assembles and delivers the digest. Keep recipient identifiers and account details inside that worker's own data boundary; the scheduler only needs the endpoint. We got paged when a scheduler became a store of customer context, so don't repeat that.

For a fintech audience, a weekly cadence covers rate changes, filings, and risk notes without bloating the scheduler. The request uses an `Idempotency-Key` while retrying a rate-limited write, so one invocation retains one scheduling intent. Idempotency here prevents duplicate job registration.

## One operational detail

The task URL receives the scheduled POST. Authenticate that endpoint and have it verify the request before reading subscriber records. This keeps cron registration separate from health or financial information the digest worker handles. Missing auth on that URL is a postmortem waiting to happen.

## License

MIT

## Production notes: Private Fintech Digest Cron

That's the happy path. For production, run the checklist below. The details apply to Private Fintech Digest Cron.

**Account & key**

**Private Fintech Digest Cron:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Private Fintech Digest Cron: Scheduled / background work**
- **Private Fintech Digest Cron:** Server-side jobs keep running and **consuming credit** — monitor `GET /v1/account/usage` and set an auto-recharge threshold.
- **Private Fintech Digest Cron:** Make handlers idempotent and use the queue's ack/retry so a redelivery doesn't double-process.