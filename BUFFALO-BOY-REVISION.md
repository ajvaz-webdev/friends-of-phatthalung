# Buffalo Boy — approved revision

Reviewed locally and approved for publication on September 3, 2026. The existing site, photos, metadata, custom domain, and publishing configuration are unchanged. The food-power heading now reads “Bit of local food staples.”

## What changed

- A stockier eight-pose water-buffalo atlas inspired by the supplied graphic, with curved cream horns, a broad muzzle, short legs, and distinct jump, landing, hurt, and victory poses. Animation timing, blinking, ear/tail accents, dust, splashes, outlines, and power effects add movement.
- More detailed limestone ridges, rice paddies, palms, houses, and Khao Ok Thalu. The landmark appears in the distance, grows around halfway, and recedes after the player passes. Movement slows slightly nearby.
- Four timed abilities share one system: Durian gives 10 seconds of faster movement, higher jumps, invulnerability and smashing; Cha Yen gives 9 seconds of hold-to-rise/release-to-descend flight; Mala gives 10 seconds of automatic playful fireballs; Mango Sticky Rice gives 12 seconds of double jumping. A different timed pickup replaces the current ability. Mangoes and Moo Ping remain independent.
- Six Durian pickups, optional power-related secret routes, and one separately tracked Golden Mango near the Khao section. This report intentionally does not disclose its exact hiding place.
- Five checkpoint stops beyond the starting point. Each saves a deep copy of pickups and interactive objects. Death restores that snapshot and clears the temporary power, making upcoming pickups available again. Collected mangoes, discovered secrets, and the Golden Mango are retained.
- Harmless animals and background traffic remain safe. Dangerous chickens have red bandanas and warning marks; gameplay vehicles have warning signs; switches and platforms are highlighted. Vehicle roofs are safe to land on.
- The second gate's pressure switch now sits above the wetlands bridge instead of below its walking surface. Bridge boards warn for 1.8 seconds before falling. Damage provides brief hit-stop, knockback, and 1.4 seconds of protection.
- Quarter-journey Thai messages, a compact progress track, clear power timers, and a small start legend. The status panel sits above the canvas so it cannot obscure flight on a narrow phone.
- Mobile controls preserve quick taps and handle pointer release, cancellation, lost capture, window-level release, and embedded-browser mouse compatibility. Per-pointer ownership preserves simultaneous touches. Selection, callouts, dragging, and touch scrolling are disabled only inside the game/control area, not across the website.
- At the finish, seven pixel people celebrate and Buffalo Boy performs a victory pose for 3.2 seconds before the result panel appears. Results show mangoes, Golden Mango status, secrets, completion time, and Play Again.

## Validation

- Production build, TypeScript check, and targeted lint passed.
- 17 regression groups passed, including checkpoint restoration at every stop and all four abilities.
- 48 normal blue-truck jump cases passed: both vehicle directions, four approach distances, three tap/hold lengths, and 30/60 fps input timing.
- Six complete input-driven simulation runs reached the finish without deaths at 30 and 60 fps. These runs did not teleport, remove obstacles, or alter the level.
- Browser review at 375px and 390px, including two full rendered journeys, finish stats, Play Again resetting the score and position, and a sustained 4.2-second pointer hold for Cha Yen. Separate sustained LEFT/RIGHT checks returned to idle after release. No new text selection appeared during the control holds; pre-existing selection outside the game remained untouched.
- Localhost and the Wi-Fi address both returned HTTP 200. The sprite asset loaded successfully and the page retained `noindex`.
- No physical iPhone/Android device was connected. Phone-width browser checks are not a substitute for an actual mobile Safari/Chrome test, especially simultaneous-touch and operating-system callouts.

## Files

- `components/BuffaloBoyGame.tsx` — rendering, interface, sound, control handling.
- `components/BuffaloBoyGame.module.css` — responsive HUD and scoped control styling.
- `components/buffalo-boy/engine.ts` — extracted and extended deterministic simulation.
- `components/buffalo-boy/qa-driver.ts` — local-only input-driven test route.
- `public/game/buffalo-poses-v2.png` — 768 × 384 transparent atlas, about 169 KiB.
- `scripts/test-buffalo.mjs` — regression checks and full-route simulations.
- `scripts/prepare-buffalo-sprites.ps1` — reproducible, user-approved background cleanup.
- `BUFFALO-BOY-REVISION.md` and `BUFFALO-BOY-ART.md` — handoff and asset provenance.

Local test controls require an explicit `buffalo-qa` query parameter in development. Their interface is excluded from the production build. Normal visitors see only LEFT, RIGHT, JUMP, and the sound toggle.
