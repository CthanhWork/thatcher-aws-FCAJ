---
title: "Scalability, Operations, and Cost"
weight: 4
---

## Operational Baseline

CloudWatch logs are the first diagnostic source for failed API calls. Track function errors, duration, throttles, API latency, RDS connections, and cache health. A practical alarm set should notify the team when error rate rises, latency exceeds the expected threshold, or the database is under sustained load.

## Scaling Path

| Stage | Change |
| --- | --- |
| MVP | Lambda, a small RDS instance, Redis, and S3 keep the operating model simple. |
| Growing usage | Tune Lambda memory, add database connection management, cache hot reads, and add S3 lifecycle policies. |
| Production | Use Multi-AZ RDS, read replicas where justified, Redis replication, WAF, CDN delivery, and asynchronous queues. |

## Cost Discipline

The MVP favors pay-per-request compute. Before adding a managed service, confirm that the performance or availability requirement justifies its fixed cost. Remove unused artifacts, empty temporary S3 objects, set log retention periods, and use lifecycle policies for old uploaded media.

Estimated costs vary by traffic and region. The key workshop lesson is to start with measurable demand, monitor usage, and scale individual components only when the metrics show a need.
