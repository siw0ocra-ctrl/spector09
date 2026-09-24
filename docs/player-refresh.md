# Player and wardrobe refresh — 2026-09-24

The old player renderer used the simulation angle directly. Movement overwrote
that angle every moving tick, while weapon firing overwrote it on attack ticks;
this could visibly snap the body between movement and attack directions. The
appearance also applied a canvas hue filter each frame.

The new presentation keeps a stable nearest-target visual aim, smooths the
shortest angular path, and animates legs from actual distance traveled separately
from body aim. It never changes projectile aiming, player speed or collision.
Standing/pause freeze the gait. Hit opacity is steady instead of rapidly flashing.
Armor is baked once per suit into at most seven 96×96 canvases and reused without
per-frame hue filters. This removes known presentation costs; it does not establish
that all device frame drops or thermal throttling are resolved.

Art: fightswithbears' CC0 2D Topdown Survival Character, unmodified rifle PNG,
plus SECTOR 09 helmet/armor panels and procedural movement. Source and license
are recorded in dist/assets/LICENSE-pilot.txt. No purchased pack was required.

Existing Ember/Ice/Royal IDs, prices and ownership are retained. New cosmetics:
Shadow 12,000 G, Solar 18,000 G, Warden 24,000 G, Prism Drone 18,000 G,
Plasma Ribbon 14,500 G. All are cosmetic only. There are six purchasable suits
plus the default, four drone skins and four bullet effects, totaling 14 products.
Client/server catalogs are identical; no migration or reset is needed.

Validation: client combat suite, combat visual parity, balance regression,
account suite, test-pilot-motion and test-pilot-cosmetics. Browser QA verifies
seven cached appearances, fourteen cards, shortest-path rotation, stationary gait,
desktop and mobile viewport rendering, and no page errors. No physical phone
frame-rate or battery measurement was performed.
