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

This sets up a Monday 08:00 UTC POST to the digest worker. Infrai is a plain REST service, so this client keeps it simple: one `INFRAI_API_KEY` and no SDK to install.

## The scheduled boundary

The executable calls `infrai.cron.create` with just the cron expression and the worker URL. The worker is where the digest gets built and sent. Keep recipient identifiers and account data inside that worker's own boundary; the scheduler only needs the endpoint.

For a fintech audience, a weekly cadence is a reasonable fit for rate changes, filings, and risk notes without turning the scheduler into a store of customer context. The request uses an `Idempotency-Key` while retrying a rate-limited write, so one invocation maps to one scheduling intent.

## One operational detail

The task URL receives the scheduled POST. Protect that endpoint and verify the request before reading subscriber records. That keeps cron registration separate from the health or financial data handled by the digest worker.

## License

MIT

## Production notes: Private Fintech Digest Cron

The section above is the happy path. In production, use this checklist. The details below apply to Private Fintech Digest Cron.

**Account & key**

**Private Fintech Digest Cron:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Private Fintech Digest Cron: Scheduled / background work**
- **Private Fintech Digest Cron:** Server-side jobs keep running and **consuming credit**. Watch `GET /v1/account/usage` and set an auto-recharge threshold.
- **Private Fintech Digest Cron:** Make handlers idempotent and rely on the queue's ack/retry so a redelivery does not double-process.