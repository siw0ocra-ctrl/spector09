# Tactical mine and wealth rules

- `shotgun` remains the storage/research/ranking key to preserve existing ownership and purchases. Its current display name and behavior are Tactical Mine (전술 지뢰).
- Mine levels 1–5 place at the player's feet every 1.78–1.30 seconds before cooldown modifiers, even with no target. Nearby placements spread deterministically. Arm after 0.4 seconds, expire after 12 seconds, cap at 7–11 (14 awakened).
- Contact trigger radius is 53–65 × area; blast radius is 85–113 × area. Explosion deals 3 × weapon damage, can critically hit, and opens chests. Only actual enemy damage counts toward contribution.
- Mine level 5 + wealth level 3 awakens Magnetic Mine: existing awakening damage multiplier, 1.4× blast radius, 0.32-second magnetic warning and 1.5-second slow for ordinary enemies. Bosses are not slowed.
- Wealth is available with every weapon, up to level 5. Each normal/rare/epic/legendary card adds 10/11/12/13.5 percentage points to combat gold. It applies to subsequent kill/chest/supply gold, after permanent and difficulty modifiers. Fractional gold carries between rewards within a run; the final fraction below one gold is discarded.
- Clear fixed rewards and arcade payouts are unchanged. Wealth is run-only. Pause shows its current percentage.
- New starts send `combatRules:2`. Finish includes at most five acquisition counter snapshots, which the server validates and uses to recompute gold by segment. Existing clients/runs without that marker keep the old shotgun/power awakening pair. No database migration or balance reset.
- The ledger is a consistency check within the existing client-reported combat model; it is not a server simulation or complete anti-cheat system.

Art: Kenney Top-down Tanks Remastered `barrelBlack_top.png` (CC0), with a stable armed indicator and magnetic field drawn in canvas. See `dist/assets/LICENSE-combat.txt`.

Validation: `test-mines-wealth.cjs`, `test-wealth-server.mjs`, existing client/combat visuals/account/concurrency/database tests, build/static-cache tests and desktop/mobile browser rendering.
