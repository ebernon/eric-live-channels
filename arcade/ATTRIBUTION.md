# Game Room — bundled open-source games

All games below are self-hosted (no external requests) and bundled under their
original licenses. Analytics/ads present in some upstream projects were removed.

| Game | Upstream | License |
|---|---|---|
| Freedoom: Phase 1 | engine recorded as github.com/raz0red/webprboom (PrBoom, WebAssembly build) · game data recorded as freedoom.github.io | engine recorded as GPL-2.0 · assets recorded as BSD-3-Clause · see `doom/SOURCE-NOTICE.md` for the exact repository evidence and unresolved provenance |
| 2048 | github.com/gabrielecirulli/2048 | MIT |
| Hextris | github.com/Hextris/hextris | GPL-3.0 |
| Clumsy Bird | github.com/ellisonleao/clumsy-bird (melonJS) | MIT |
| Pac-Man (pacman-canvas) | github.com/platzhersh/pacman-canvas | CC0 1.0 |
| Snake | written for this app | MIT |
| HexGL | github.com/BKcore/HexGL (Thibaut Despoulain) | MIT (code and resources; see `hexgl/LICENSE`) |
| Zork I, II, III | github.com/historicalsource/zork1, zork2, zork3 (released by Microsoft, 2025) | MIT (see `zork/LICENSE-zork*.txt`); "Zork" is a trademark of its owner and is used here only to name the games |
| Parchment interpreter (plays Zork) | github.com/curiousdannii/parchment, release 2026.8.23 | MIT |

Copied into Eric's Live Channels on 2026-10-12 from the Colonial Beach Game
Room (the first six rows, unchanged) and from the upstream repositories above.
HexGL was modified: its Google Analytics snippet, remote favicon and Open Graph
links, the 3 MB `package.zip`, the obsolete appcache and the CoffeeScript
source of `launch.js` were removed. The Zork story files are the repositories'
`COMPILED/*.z3` files, base64-wrapped for Parchment.

Hextris's JavaScript source and GPL-3.0 license are bundled with the game. The
repository does not preserve enough evidence to claim complete corresponding
source or a complete BSD notice for the compiled Freedoom/PrBoom bundle; see
`doom/SOURCE-NOTICE.md` before redistributing that bundle.

Hextris was modified for this app in September 2026: analytics and remote score
traffic were removed; its font is served locally; store/share controls are
hidden; the obsolete jQuery unload hook was replaced with `pagehide`; and
mid-round serialization was disabled because upstream restored saved functions
with dynamic evaluation. High scores still remain on the player's device.
