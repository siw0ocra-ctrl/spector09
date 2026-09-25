# Operations room refresh

Scope: camp and top navigation. Campaign stage choices are a connected tactical map using existing Kenney Sci-Fi RTS structures and terrain (CC0; see assets/LICENSE-combat.txt). Navigation uses the existing radar, weapon icon, rank and drone artwork, retaining their existing licenses. No new third-party assets or libraries were added.

The map decorates existing buttons after renderCamp; original click handlers, disabled gates, account synchronization and difficulty selection remain in charge. The right panel keeps the live preview, stage rewards, boss tip and deploy button. Mobile stacks map and mission information, with a dedicated header row for account controls.

Validation: all ten locations, locked regions, three difficulty choices, stage changes, all four navigation tabs, loaded images and no horizontal overflow at 390, 844 and 1024 CSS pixels. Desktop and mobile screenshots inspected. Existing client and wallet resilience tests passed. Changes are presentation only; economy and combat rules are unchanged.

Publish: run scripts/build.mjs in this source checkout before packaging, then verify both ops-room.js and OPS ROOM in the embedded Worker assets.
