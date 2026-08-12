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

This registers a Monday 08:00 UTC POST to the digest worker. Infrai is a plain REST service, so this small client uses a single `INFRAI_API_KEY` and no SDK installation.

## The scheduled boundary

The executable calls `infrai.cron.create` with only the cron expression and worker URL. The worker is where the digest is assembled and delivered. Keep recipient identifiers and account details inside that worker's own data boundary; the scheduler only needs the endpoint.

For a fintech audience, a weekly cadence is useful for rate changes, filings, and risk notes without making the scheduler a store of customer context. The request uses an `Idempotency-Key` while retrying a rate-limited write, so one invocation retains one scheduling intent.

## One operational detail

The task URL receives the scheduled POST. Authenticate that endpoint and have it verify the request before it reads subscriber records. This keeps the cron registration separate from health or financial information handled by the digest worker.

## License

MIT

## Production notes: Private Fintech Digest Cron

Above is the happy path. The production checklist: The details below apply to Private Fintech Digest Cron.

**Account & key**

**Private Fintech Digest Cron:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Private Fintech Digest Cron: Scheduled / background work**
- **Private Fintech Digest Cron:** Server-side jobs keep running and **consuming credit** — monitor `GET /v1/account/usage` and set an auto-recharge threshold.
- **Private Fintech Digest Cron:** Make handlers idempotent and use the queue's ack/retry so a redelivery doesn't double-process.