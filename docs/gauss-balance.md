# Gauss growth balance

Normal: levels 1–2 fire one projectile at 100% weapon damage; 3–4 fire two at 65% each; 5 fires three at 50% each. Damage percentages are relative to that level's weapon stat, before critical hits. Existing level/research/rarity/cooldown modifiers remain.

Overdrive requires the existing rapid passive at level 3. It retains three projectiles at 50% each with the existing 1.65 awakening damage multiplier. Each projectile hits at most five targets instead of three, with lifetime 1.6s instead of 1.2s at 550 units/s (880 versus 660 travel distance). Existing rail trails distinguish awakening. No extra fire-rate multiplier is claimed or added.

## Reproducible comparison

Run `node tests/bench-gauss-balance.cjs` and `node tests/bench-gauss-motion.cjs` from the repository root. These use the actual 60Hz combat loop with level 5 weapons, no permanent upgrades or rarity bonuses, rapid level 3 on all builds, and critical hits disabled. Awakening is explicitly toggled for equal offensive conditions; passive acquisition costs and each weapon's paired passive are not simulated.

Thirty seconds, stationary player, durable targets. Boss-sized target: radius 45 at distance 90. Line: 24 radius-18 targets in three rows, 65–380 units forward. Surround: 24 targets at radius 110. Values are rounded effective damage per second, not full mission win rates.

| Weapon | Normal single | Awakened single | Awakened line | Awakened surround |
|---|---:|---:|---:|---:|
| Gauss before | 128 | 631 | 1894 | 1052 |
| Gauss after | 191 | 316 | 1576 | 526 |
| Tactical mine | 129 | 206 | 1854 | 4466 |
| Laser | 70 | 344 | 1836 | 574 |
| Missile | 54 | 266 | 2393 | 2924 |
| Nova | 32 | 53 | 798 | 1276 |
| Drone | 203 | 670 | 670 | 670 |
| Flame | 77 | 127 | 1526 | 3052 |
| Lightning | 25 | 41 | 571 | 571 |

Awakened 5,000-HP boss-sized dummy kill time: gauss 15.88s, laser 13.90s, missile 18.07s, drone 7.27s, mine 24.50s. Circular motion at radius 90/angular speed 0.8 rad/s produced the same times under this generous hitbox. At distance 300, gauss took 16.27s, missile 18.73s, drone 23.70s, laser 43.30s; stationary mines/nova/flame could not reach it. This validates a long-range focus without highest point-blank damage.

Conclusion: normal growth improves approximately 50% at level 5; awakened single-target damage drops 50% versus the old three full-damage rounds. Extra penetration compensates in aligned crowds, without exceeding other crowd specialists in the measured setups. Dense stationary targets strongly favor explosions; actual boss patterns, mobility, target size, upgrades and mixed loadouts still affect balance. This is an initial measured tuning, not proof of universal balance.
