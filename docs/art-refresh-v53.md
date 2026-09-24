# Suit silhouettes, attack cosmetics and boss cohesion

- Existing six purchasable suits retain their IDs, prices and ownership, but each
  now has distinct headgear and major silhouette: respirator/heavy shoulders,
  polar hood/coat, pointed knight helmet/cape, triangular stealth hood, shield/T
  visor, or mechanical head/wing modules. The default remains a simple scout.
  Cached frames still avoid per-frame filters.
- The four existing bullet cosmetics now also decorate laser/lightning paths,
  nova/mine/missile explosion rings, placed mines and steady flame emitters.
  Drone rendering is excluded and keeps its separate drone cosmetic category.
  Theme geometry differs (chevrons, crystals, stars, curved ribbons); overlays
  do not alter damage, range, collision, timers or RNG. Simple Effects reduces
  motif counts; there are no new random/rapidly flashing flame effects.
- The appearance shop calls this category Attack Effects and includes a preview
  selector for each of the seven supported weapons. Purchases still use the same
  server IDs/prices. Catalog text is synchronized on client/server.
- Ten bosses use the same CC0 alien sheet as ordinary enemies, with different
  carapace/limb arrangements. Hard/Extreme add crests. Only drawBoss is replaced;
  boss attack patterns, warning rendering, hitboxes and difficulty stats remain.
  Source: dist/assets/LICENSE-alien-bugs.txt. No additional asset download.

Validation: 64 browser weapon/theme/awakening combinations, with positive cosmetic
draws for all seven supported weapons and zero attack-skin draws for drone;
28 shop previews; desktop/mobile suit and boss galleries; client combat and
visual parity tests; existing purchased-item/server-price/replay tests. Rendering
cache sizes are bounded by the fixed seven suits and 60 boss variants (ten stages,
three modes, normal/hit). Actual phone GPU/thermal performance was not measured.
