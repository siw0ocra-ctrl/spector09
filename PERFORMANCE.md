# Optimization measurement — 2026-09-17

Baseline source: `e1bed17e91bd7d95db1a60f61bc38e44b0e3a627`.
Run `node scripts/benchmark-optimization.mjs ROOT OUTPUT_JSON` against each source tree on the same machine. Node 24, in-memory SQLite; no network or rendering is included. API measurements are medians of 30 samples after 5 warmups with 10,000 synthetic ranking rows. Combat is the median of 10 batches of 60 ticks after 2 warmup batches, with 180 stationary enemies and 200 homing projectiles. This is a deliberately heavy homing workload, not a typical mobile FPS result.

| Measurement | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Arcade status local API time | 23.459 ms | 0.210 ms | 99.1% |
| Cashout local API time | 23.476 ms | 0.307 ms | 98.7% |
| Ranking local API time | 24.855 ms | 0.738 ms | 97.0% |
| Combat simulation per tick | 38.588 ms | 0.496 ms | 98.7% |
| Status SQL statements | 4 | 1 | 75.0% |
| Cashout SQL statements | 9 | 7 | 22.2% |
| Ranking SQL statements | 2 | 1 | 50.0% |
| Status JSON size | 719 B | 649 B | 9.7% |
| Cashout JSON size | 892 B | 822 B | 7.8% |

Ranking fixtures have no equipped ranking titles. That query now skips global title standings when no displayed player needs them. Rankings with equipped rank-based titles still validate live standings and will not have the same improvement. Purchased titles do not need standings validation. Status/cashout explicitly opt into the lean response, preserving full wallet/game state while deferring computed title eligibility to existing full-profile refreshes. These local numbers exclude D1 remote latency, authentication infrastructure, TLS and the user's network. They must not be presented as production response time reductions or frame-rate guarantees.

Changes: authenticated player JOIN, remove redundant status read, omit standings work on opted-in arcade responses, skip unused leaderboard standings, reuse fresh browser ranking cache, preload remaining maps every 3 seconds only while visible and outside battle, linear nearest-target search, one target list per projectile phase, squared collision distances, 10 Hz continuous HUD updates with immediate explicit-event refresh, cached loadout markup, content-derived ETag/304 for static assets. ETags eliminate unchanged response bodies on revalidation, not initial download or the network round trip. Static assets remain embedded in the Worker.

Verification: account/transaction and title boundary tests; all eight weapons, 30 boss combinations and 5/3/1 slots; WebSocket authorization tests; compact/full cashout replay without duplicate credit; stale profile ordering and preserved title rendering; immediate HUD event refresh; HTML/JS/PNG ETag checks. A deterministic 60-tick mixed-projectile comparison against baseline produced identical positions, damage, hit counts and lifetimes.

Production WebSocket remains gated off due to the previously observed hosting upgrade failure. This optimization works through the existing HTTP path and does not claim to remove network latency. No wallet or ranking data migration is required.
