# Weapon slot icons

All eight weapon slots use embedded-image SVG icons instead of platform-dependent emoji. Weapon research uses the same icons. Mobile remains 27px inside the existing slots, desktop 32px; empty slots, gold awakening borders, accessible weapon names and tap-to-pause behavior are preserved.

Gauss/laser/flame/lightning assemble the CC0 PIXWEP modules by Zintoki, https://zintoki.itch.io/pixwep (creator declaration checked 2026-09-24). Mine/drone reuse existing Kenney CC0 assets. Nova and identifying accents are original SVG geometry. See `dist/assets/LICENSE-weapon-icons.txt`.

Self-contained SVG files do not request any third-party resource at runtime. The build now serves SVG with image/svg+xml and ETag validation. All eight icons total approximately 67 KiB. Browser checks covered desktop/mobile rendering, every image decoding, five slots including empty states, awakening borders, armory consistency and slot tap opening pause stats. Combat behavior is unchanged.
