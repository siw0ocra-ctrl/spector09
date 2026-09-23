# Combat presentation update

Scope: all ten campaign maps, plus all eight weapon presentations across every map.

- Stage 1: world-anchored sand/road tiles, hangars, radar, solar panels, generators, rocks and sandbags. Decorations are non-colliding and rendered beneath gameplay.
- Stage 1 enemies: original claw creature, light scout chassis (same melee behavior), twin-barrel ranged chassis and heavy armor chassis. Stage 1 boss uses modular tracks/turrets, with additional Hard/Extreme equipment. Other bosses retain their original distinct designs.
- Friendly drone retains equipped cosmetics and gains a small engine plume.
- Stages 2–10: canyon, frozen laboratory, contaminated garden, hive, foundry, void citadel, eclipse chamber, abyss and origin have distinct world-anchored floor textures, route layouts and Kenney scenery. Cached floor tiles retain details after tinting. Props are decorative and do not block movement.
- Stage-specific enemy factions combine light chassis, artillery, twin-cannon heavy armor, crystal armor and biological shells. Existing role, health, speed and attack behavior remain unchanged.
- Organic enemy poses and attachments are baked into a lazy cache capped at 96 small frames; offscreen enemies retain the existing culling behavior.
- Nine remaining bosses retain their distinct silhouettes and gain anatomy-specific ore claws, ice clusters, spores, crystals, furnace cannons, solar wings, orbiting crystals, segmented ore armor and six reactor guns. Existing Hard/Extreme attachments and warnings remain active.
- Gauss tracers, shotgun shells, missile bodies/exhaust/blasts, layered laser beams, expanding nova rings, drone beams, flame plumes and branching lightning have distinct shapes. Awakenings reuse their actual existing shot counts and ranges.
- Hit flashes, directional sparks and throttled impact sounds; existing sound toggle applies.
- Overdrive gauss uses long layered rail trails and parallel energy filaments. Flame presentation uses a continuous, gently fading emitter across damage ticks, with warm low-opacity embers instead of bright impact/critical flashes. Both changes preserve attack stats and damage timing.

Presentation hooks consume no gameplay randomness and do not change damage, cooldowns, range, movement or collision. `test-combat-visuals.cjs` compares normal and awakened simulations against unwrapped combat and checks effect bounds/pause/reset. Effects are capped at 96; offscreen transient effects/projectiles are skipped. Particle PNGs are resized to 96px and tinted once per color, avoiding per-frame image filters.

Sources and CC0 license: `dist/assets/LICENSE-combat.txt`.
