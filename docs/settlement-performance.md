# Settlement latency audit and optimization

## Measurements

Ten finish operations, real API with in-memory SQLite, level 9/101 kills fixture, identical receipt replay checks. Before/after: DB round trips 4 → 3; SQL statements 6 → 5; ranking title queries on the payment response path 1 → 0. Local mean 0.94 → 0.66 ms. Injected DB delay benchmark mean 124.43 → 93.03 ms (~25.2% reduction). Configured delay was 20ms per trip; Windows timer scheduling yielded approximately 31ms per wait. These are controlled local measurements, not production network latency or a guaranteed user-perceived improvement. Deferred title queries still occur after payment, rather than disappearing entirely.

## Changes

- Finish requests opt into the existing compact profile protocol. It preserves all authoritative wallet/campaign/revision state and omits only ranking-derived title computation. Existing titles stay visible until refreshed.
- The result screen schedules a separate title refresh after rendering, without awaiting it. Errors in that optional request cannot block the wallet update.
- A pending-operation retry reuses the committed response instead of following it with session and sync requests (3 requests → 1). An already-connected manual refresh uses sync alone (2 → 1). New sessions retain session establishment.
- HTTP operation/status responses now include Server-Timing durations for auth, receipt lookup, validation, transaction, title calculation where present, and total. Network-panel duration includes network overhead; total covers server handler time. Timing values contain no player identifiers or payloads. Metrics are per request, never shared globally.
- Wallet and durable receipt remain in the same transaction. Stale revision retry and the original operation ID remain intact.

## Validation

bench-settlement.mjs verifies compact finish, replay and timings with EXPECT_FAST=1. test-wallet-resilience checks post-commit response loss, one-request reconnection, rollback and concurrent affordability. Account, extended account, DB roundtrip, exploration and client suites pass. Actual production timing must be observed on real user requests; no production accounts or balances were changed to run benchmarks.
