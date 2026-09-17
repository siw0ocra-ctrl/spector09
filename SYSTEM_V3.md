# SECTOR 09 — campaign and account version 3

## Runtime

Static assets and the Canvas simulation run in the browser. The existing Sites Worker serves `/api/v3/*`; the existing `DB` D1 binding stores anonymous players, hashed sessions, durable operation receipts, recovery rate limits, and rankings. `SAVE_KEY` remains the existing secret and is used for HMAC recovery-code issuance. No new authentication provider or login library is required.

`server/api.mjs` is the authoritative wallet and progression implementation. `server/catalog.mjs` contains server prices for cosmetic products. `dist/assets/account-ui.js` coordinates requests and the campaign UI; local storage from versions 1 and 2 is never read. Session storage contains only unresolved operation requests and the ID of the current browser's run, never an authoritative wallet.

All wallet mutations compare the stored revision and atomically write the new player state plus an operation receipt in one D1 batch. A retry uses the same ID and payload; changing a payload under an existing ID is rejected. Normal status polls do not write receipts. The client ignores profiles older than its current revision. Unknown network outcomes retain the operation for retry; confirmed application errors release it.

## Gameplay

Normal/Hard/Extreme each have 10 stages. Clearing all ten unlocks the next campaign and promotes the server-derived rank. Maximum weapons: 5/3/1. Hard and Extreme choose from the eight existing weapons. Extreme gains weapon levels at character levels 3, 5, 7 and 9 and receives only passive cards. Weapon 5 + paired passive 3 still awakens; passive cap is 5. Existing rarity and per-slot/shared reroll rules are retained.

Difficulty multipliers are unchanged from the requested initial values: enemy HP 1/1.15/1.25; damage 1/1.2/1.4; movement and projectile speed 1/1.08/1.15; spawn frequency 1/1.10/1.15; boss HP 1/1.10/1.15; boss cooldown 1/.90/.80; gold 1/1.30/1.60; XP 1/1.10/1.20. Dash speed and telegraphs are independent of these multipliers. Enemy count is capped at 180. Boss starts at 180 seconds. Chest gold uses a fixed base of `30 + stageIndex * 5` so the server and displayed pending reward agree. Kill and chest gold apply permanent gold research once; clear reward applies the difficulty multiplier once. Max-level gold supply gives 25G without a combat multiplier.

Ten silhouettes have Normal/Hard/Extreme attachments and patterns in `boss-modes.js`. Additional stage hazards stop while a boss is alive, leaving its own telegraphs and escape space. Boss death clears pending combat hazards/projectiles. All combat timing freezes while paused.

## Recovery and interrupted play

The anonymous session is an HttpOnly/Secure/SameSite cookie; public player IDs do not authenticate. Recovery codes are 256-bit HMAC outputs. Only the code hash is stored; an idempotent issuance can reproduce its response without storing the plaintext. Reissuing replaces the hash. Recovery attempts are limited per hashed IP. Existing authenticated sessions remain valid after code reissue. No sessions plus no code means no recovery.

One active battle, rocket, or Plinko game is allowed per player. A browser retaining its running simulation can finish after reconnecting. Reloading that browser ends its unrecoverable battle without fabricated rewards. A different browser can explicitly stop an abandoned run. Runs expire after 24 hours; accepted simulated duration is at most two hours.

Rocket crash points are never sent before settlement. Server time decides cashout, including a 100x automatic exit if the crash point is later. Plinko path and result are generated on the server. Disconnected games are settled when status or another operation is next requested; settlement uses their original result/time, not reconnection time. Casino outcomes do not receive campaign multipliers.

## Rankings and the one-time reset

Generated migration `0001_steady_psynapse.sql` creates the v3 tables and **drops only the legacy `scores` table**. Its migration journal makes this a one-time change. There is no startup deletion or archive of old test scores. Legacy `/api/*` endpoints return 410, so old encrypted tickets cannot add new scores.

Ranking queries partition by difficulty and map. Extreme weapon filtering is applied before selecting TOP25. Overall Extreme selects one fastest record per player; stored Extreme records retain each player's best per weapon. A user must manually submit a nickname using an authenticated successful finish receipt.

## Validation and remaining limits

### Title collection (SHOP)

Five permanent purchasable titles cost 1,500 / 4,000 / 8,000 / 15,000 / 30,000G. Server state `titles.owned` and `titles.equipped` is added lazily for existing v3 accounts without resetting progression. Purchase grants and equips atomically; equip only accepts owned catalogue IDs, and `null` unequips. Titles have no combat bonuses.

Twelve temporary ranking titles cover TOP25 / TOP10 / TOP3 / first place independently for Normal, Hard and Extreme. Current standings on any map overall board determine eligibility. The server rechecks on equip and profile/leaderboard reads; a lost qualification hides the title and prevents equip. Legacy permanent ranking IDs are removed from public ownership, preserving paid titles and progress. Visible camp/title/leaderboard screens refresh every 30 seconds and on returning to the tab. Weapon-specific Extreme boards do not separately qualify.

UI art uses Kenney Medals and Ranks Pack (CC0); source links and licenses are in the collection and asset directory. Local API tests cover prices, replay protection, old-profile defaults, ownership, leaderboard display, temporary ranking eligibility and revocation, and eligibility boundaries 26/25/10/3/1. Browser QA covers purchase/equip/unequip/reload, mobile layout, asset loading, and the no-ranking empty state.

Run `npm test` (Node 24) for SQLite migration/API tests, concurrent purchases, replay protection, account recovery, progression/promotions, wallet multipliers, casino settlement, weapon-filter ordering, all eight weapon attacks, Extreme growth/awakening, and all 30 boss combinations. Browser tests were also run for tabs, desktop/mobile layout, real start/pause/settlement/reload, dropped purchase responses and automatic Plinko settlement.

Server validation checks ownership, unlocks, duration, active run, weapon limits, level/XP budget and bounded kill/chest claims; it computes the award rather than trusting a supplied balance. **The server does not replay the full combat simulation. Modified clients can still fabricate plausible combat statistics.** Eliminating that requires a separate deterministic replay or authoritative simulation project. Automated checks verify damage and pattern execution, not a proof that every weapon/difficulty/map is equally balanced for a human player; live playtesting remains useful before tuning the requested multipliers.

## Realtime transport

`/api/v3/live` upgrades authenticated, same-origin browser connections to WebSocket. Browser commands retain the HTTP operation IDs and D1 transactional receipts. Socket errors/timeouts retry the identical payload through HTTP; a disconnected transport never authorizes gold locally. Recovery remains HTTP-only. Arcade deadlines are computed privately from the stored round and send the settled profile through the open socket; HTTP polling resumes on disconnect.

Connections in the same Worker instance exchange invalidation hints for wallets and ranking submissions. Instances do not share an in-memory connection registry. A 10-second heartbeat reconciles profiles and visible rankings across instances; this is bounded synchronization, not a globally immediate broadcast. Persistent coordinated fanout would require an additional supported shared connection service (for example Durable Objects). No such unsupported binding is declared in this Sites project. Socket inactivity closes after 45 seconds; clients reconnect with backoff and use current session authentication. Full API authorization, origin checks, frame limits, per-connection rate limits and revision ordering remain in force.

Validation: WebSocket authorization/allowlist checks, real browser two-tab wallet updates, server-driven Plinko completion without HTTP polling, lost acknowledgement HTTP replay with one charge, and reconnection.

Production verification (2026-09-17): the custom-domain authenticated WebSocket upgrade returned the Sites dispatcher platform-error HTML (HTTP 500); normal session requests succeeded. Worker logs showed the upgrade invocation canceled without an application error. Therefore realtime is NOT enabled in production. `/api/v3/live-config` defaults to disabled unless the runtime variable `REALTIME_ENABLED=true` is explicitly set after verifying the hosting upgrade path. Clients stay on the existing HTTP transport without endless upgrade retries. Local browser end-to-end tests passed on the same protocol implementation. To activate production, resolve the hosting WebSocket forwarding failure or provision an authorized separate realtime endpoint and its authentication/data integration.

Isolated hosting diagnostic (2026-09-17 11:02–11:03 UTC / 20:02–20:03 KST): temporarily deployed a standalone echo handler ahead of the game API, with no authentication, database or game state. Tested using a Node WebSocket client, outside any browser or iframe, on both the custom domain and the default Sites origin. On each origin, plain HTTP returned 200 with `WebSocketPair` available; an intentional upgrade rejection returned the exact diagnostic 426 response; two actual upgrades each returned platform HTML 500 instead of opening a socket (4/4 failures total). Custom-domain Worker logs recorded `entry` with `upgrade:true`, followed by `return-101` after constructing the response, then invocation outcome `canceled`, with no handler exception. Example correlation rays: `a3c79ee85f11f246-ICN`, `a3c79ee97eee3f26-ICN`. This localizes the observed failure to the deployed upgrade-response/runtime forwarding path, independent of game logic, D1, browser CSP and the custom domain alone. It does not prove that all Sites deployments lack WebSocket support or identify the platform's exact internal defect. The temporary handler was removed after testing; the game remains on HTTP. Resolution requires hosting-side investigation of these request IDs or validation on another supported endpoint before re-enabling realtime.
