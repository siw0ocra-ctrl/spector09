# Combat, usability and economy review

## Applied changes

- Lightning first hit: 0.8 → 2.4 × weapon damage; subsequent chain hits: 0.8 → 0.9 ×. Chain length, range, cooldown and crit rules unchanged. Target selection scans for the nearest live target rather than repeatedly sorting the list.
- No drone or mine damage nerf: drone retains close-range single-target specialization; mine requires positioning. Boss reachability is not evidence that a player can safely face-tank bosses.
- Pause screen shows actual per-hit damage, shot/drone/chain count, attack interval, range/radius and mine capacity/arming/lifetime. Soldier Asset Growth explicitly says permanent; field Asset Growth says this operation only. Gold exclusions and fractional accumulation are explained.
- Optional pause-screen Simple Effects setting is stored on this browser. It suppresses muzzle/impact decoration, reduces flame particles and simplifies explosion decoration. Simulation, hostile projectiles, boss warnings and attack geometry remain unchanged.

## Weapon comparison

`node tests/bench-paired-weapons.cjs`: actual 60Hz combat loop, level-5 awakened weapons with their own level-3 paired passive, zero permanent research, five deterministic RNG seeds. Thirty-second circular moving radius-45 durable target at radius 100; seeded critical hits enabled. DPS: gauss 316, mine 153, laser 261, missile 307, nova 40, drone 500, flame 100, lightning **40 before → 119 after**. This compares distinct complete awakening packages rather than forcing all weapons to use rapid.

The finite 40-enemy wave (160 HP, approach speed 40) was cleared by all except gauss within 30 seconds; gauss killed 19. Finite-wave DPS saturates at 213 once the wave is dead and must not be read as equal offensive strength. Gauss preserves range, but weak coverage when surrounded. No global rebalance based on only one geometry.

## Mine boss patterns

`node tests/bench-mine-bosses.cjs`: Hard and Extreme × all ten actual boss patterns; awakened mine + wealth 3, no permanent upgrades or extra weapons. A scripted controller approaches within 95 and orbits if closer than 70. All twenty bosses took damage and were killed in 10.2–48.8 seconds. Normal wave spawns disabled; HP set high to isolate reachability; incoming damage still measured (up to 1,588). These are **not survival/clear-rate tests**. An immobile player outside mine range cannot damage ranged enemies; the pause screen explicitly explains approaching to plant. Bosses remain immune to magnetic slow.

## Mobile rendering

Local Chrome, 844×390 touch viewport, 4× CPU throttle, 180 durable enemies and five awakened weapons, 600 simulation/draw iterations, first 120 excluded. Standard median 4.0 ms / p95 25.5 ms; simple effects median 2.5 ms / p95 22.2 ms (37.5% / 12.9% reduction in this sample). Event peak 96 → 4. Portrait 390×844 pause scrolling and toggle interaction also checked; no page errors. These measure JavaScript simulation/draw-call time, not GPU presentation, network or physical-phone touch latency. Occasional >16.7ms work remains; this is not a 60fps guarantee.

## Growth and economy

`node tests/bench-growth-economy.cjs`: 200 seeded runs per mode, three offered cards, no rerolls, one target awakening prioritized; Normal targets gauss, Hard/Extreme target mine. Uses the real pool, choice and auto-growth logic. This measures availability by level, not the rate at which players earn XP. It does not model optimal rerolls, multi-weapon synergies or actual mission completion.

| Mode / target | Awakened by level 18 | By level 25 | By level 30 |
|---|---:|---:|---:|
| Normal / gauss | 30% | 66% | 88% |
| Hard / mine | 41.5% | 84% | 95% |
| Extreme / mine | 96.5% | 100% | 100% |

Extreme auto weapon growth materially speeds up single-weapon awakening. Normal/Hard need more selections; rerolls were intentionally omitted to show this dependency. No guaranteed-awakening mechanic was introduced.

Example payout model: 1,000 kills with repeating types [basic,basic,basic,ranged,heavy], permanent gold level 5, normal wealth cards at kills 100/250/400/550/700, stage-one clear fixed reward, no chests. Normal 5,180 → 6,680 G (+29.0%); Hard 6,034 → 7,774 (+28.8%); Extreme 7,688 → 9,908 (+28.9%). Wealth is not retroactive and does not multiply fixed rewards. Prices, odds and reward rates remain unchanged: illustrative runs are insufficient to predict actual time to buy all upgrades.

Validation: existing client, Gauss growth, mines/wealth, combat visuals, wealth settlement tests; new `test-review-combat.cjs` covers lightning multipliers/range and simple-effects simulation/RNG parity. No database migrations or player-data resets.
