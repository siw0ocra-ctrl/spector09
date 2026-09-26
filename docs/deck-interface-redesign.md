# Command-deck interface rollout

Applied in order: level-up/pause/results, research armory, cosmetic store, rankings/account/arcade. Existing licensed Kenney structures and weapon artwork are reused. No external image dependencies were introduced.

- Choice cards retain rarity names, colors, exact gains and original selection/reroll handlers. Asset illustrations distinguish weapons and modules.
- Pause and damage reports display owned weapon art. Result and nickname controls use mobile-friendly spacing.
- Research cards display equipment icons and ten-segment weapon research progress.
- Cosmetic store adds suit/drone/effect category filters and a larger suit preview. Preview selection does not purchase, equip or modify ownership. Purchases remain in the existing server-backed buttons.
- Ranking filters, recovery inputs, arcade controls and title cards share the command-deck palette and border system.

Validation: Playwright exercised all research tabs, disabled purchases, free fitting state invariance, cosmetic filters, all four attack previews, titles, both arcade games, ranking/data dialogs, level-up selection, pause/resume and clear registration. Desktop and 390px mobile screenshots inspected, horizontal overflow checked. Existing client, wallet resilience and cosmetic catalog/purchase suites pass. No economy or combat-rule changes.

Build scripts/build.mjs in this checkout before packaging. Verify deck-interface.js/css and their HTML references inside the generated Worker asset map.
