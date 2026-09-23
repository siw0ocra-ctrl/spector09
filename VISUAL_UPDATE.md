# Combat presentation update

Scope: first campaign map art pass, plus all eight weapon presentations across every map.

- Stage 1: world-anchored sand/road tiles, hangars, radar, solar panels, generators, rocks and sandbags. Decorations are non-colliding and rendered beneath gameplay.
- Stage 1 enemies: original claw creature, light scout chassis (same melee behavior), twin-barrel ranged chassis and heavy armor chassis. Stage 1 boss uses modular tracks/turrets, with additional Hard/Extreme equipment. Other bosses retain their original distinct designs.
- Friendly drone retains equipped cosmetics and gains a small engine plume.
- Gauss tracers, shotgun shells, missile bodies/exhaust/blasts, layered laser beams, expanding nova rings, drone beams, flame plumes and branching lightning have distinct shapes. Awakenings reuse their actual existing shot counts and ranges.
- Hit flashes, directional sparks and throttled impact sounds; existing sound toggle applies.

Presentation hooks consume no gameplay randomness and do not change damage, cooldowns, range, movement or collision. `test-combat-visuals.cjs` compares normal and awakened simulations against unwrapped combat and checks effect bounds/pause/reset. Effects are capped at 96; offscreen transient effects/projectiles are skipped. Particle PNGs are resized to 96px and tinted once per color, avoiding per-frame image filters.

Sources and CC0 license: `dist/assets/LICENSE-combat.txt`.
