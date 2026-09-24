# Combat, mobile controls and store scope — 2026-09-24

## Balance

The paired-weapon benchmark uses five seeds, 30 seconds, level 5 awakening,
the matching level 3 passive and zero permanent research. A durable target
circles at radius 100; this is a controlled damage comparison, not a clear-rate
or survival prediction.

| Weapon | Before DPS | After DPS |
| --- | ---: | ---: |
| Gauss | 316 | 316 |
| Tactical mine | 153 | 153 |
| Laser | 261 | 261 |
| Missile | 307 | 307 |
| Nova | 40 | 56 |
| Drone | 500 | 500 |
| Flame | 100 | 120 |
| Lightning | 119 | 119 |

Nova damage coefficient 1.5 → 1.8; cooldown 3.6 − level × .2 → 3.2 − level × .2.
Flame coefficient .35 → .42, with unchanged cadence, range and visual intensity.
Both retain their area-control roles and short reach. The finite 40-enemy wave
still reaches its damage ceiling for these weapons, so it does not establish
equal swarm strength. No other weapon nerfs or enemy/difficulty changes: there
is no representative player clear-rate dataset to justify those changes.
Pause-screen numbers match the new coefficients at every level.

## Mobile

- One captured pointer owns the joystick. A second finger can press stim.
- Five-pixel dead zone, travel scaled to the visible stick, and cached gesture
  bounds. Cancel, capture loss, pause, level-up, blur and resize reset movement.
- Stim triggers on pointer press, with keyboard/assistive click activation kept.
- Coarse-pointer devices default to simple effects only if no saved preference
  exists. Users can change it in pause. Attack geometry and warnings are intact.
- No continuous battle redraw while paused/hidden. Resize still redraws a paused
  canvas. Offscreen effects/projectiles/orbs are skipped for rendering only;
  experience gems share a draw path. Simulation is unchanged by these measures.
- Drone targeting uses a linear scan, preserving range, enemy-before-chest
  priority and stable equal-distance ordering; 1,000 generated parity cases pass.

Chrome, touch viewport 844×390, 4× CPU throttle, 180 durable enemies, five awakened
weapons, 600 update/draw iterations with warm-up excluded:

| Sample | Standard median / p95 | Simple median / p95 |
| --- | --- | --- |
| Before | 4.0 / 25.2 ms | 2.8 / 21.7 ms |
| After | 4.3 / 25.3 ms | 3.2 / 22.9 ms |

The same-mode measurements do not demonstrate a speedup; differences include
timing noise and changed damage work. The final simple preset costs about 26%
less median / 9% less p95 than standard in the same run. This supports the mobile
default but is not a claim of equivalent FPS gains. Paused redraw elimination
and input-reset behavior have separate browser assertions. Physical-phone GPU,
thermal behavior and real touch latency were not measured.

## Store

All nine appearance products explicitly list supported actors/weapons, cosmetic
only status, permanent ownership and free equipment switching. Bullet cosmetics
apply to Gauss and missiles, including awakenings. Prices, server purchase
transactions and ownership semantics remain unchanged.

Validation: test-client-v3, test-review-combat, test-balance-mobile-v51,
bench-paired-weapons, browser multi-touch/cancel/pause/preference/store checks,
390×844 shop screenshot, build and static cache checks.
