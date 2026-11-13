# Buffalo Boy — three-level adventure

Implemented and validated September 3, 2026 against the user's master brief.

## Delivered

- Rice Field Road, Thale Noi Trails and Town & Market Dash share the existing
  lightweight Canvas engine, with distinct scenery, hazards, secrets, power
  placements and checkpoint snapshots.
- A compact journey map unlocks routes sequentially and permits replays.
  Personal bests merge without double-counting fruit or stamps. Progress lasts
  while the page remains open; there is no account or persistent tracking.
- Seven major powers: Durian, Cha Yen flight, Mala fire, Sticky Rice double jump,
  KFC delivery bike, Coconut Shield and Khanom Mango Magnet. Moo Ping health and
  the Golden Mango remain independent. The bike has a dedicated rider sprite,
  spinning-wheel accents, sound, dust, speed lines, small-crate traversal and a
  bonus route. All powers retain only LEFT / RIGHT / JUMP controls.
- Required powers and mechanisms restore from checkpoint snapshots after a
  fall or loss of hearts. Collected mangoes, secrets and Golden Mango remain
  recorded. Blue-truck collision bounds allow generous ordinary jumps.
- Khao Ok Thalu grows into a halfway set piece with a short scenic slowdown,
  original mountain art/opening, a small 7-Eleven and Thai encouragement.
- Six stamps, optional power-based secrets, distinct danger markers, passive
  animals, original retro sounds and increasingly large randomized celebrations.
- Flight arrivals land Buffalo Boy in front of the building. The celebration
  plays for 3.2 seconds before results appear below the canvas.
- 30 cleaned original sprites and three original background strips match the
  existing buffalo atlas. Runtime timber-gate and guest-arm rigs animate parts
  of these sprites. No emoji are used as gameplay artwork.

## Input and layout fixes

- Pointer ownership keeps concurrent movement and jump independent. Release,
  cancellation, lost capture, mouse compatibility release, blur and resize
  clear/reconcile held controls. Reused mouse pointers cannot leave an old
  direction latched. Fast jump taps remain queued until the next frame.
- Selection, callout, dragging and touch gestures are suppressed only inside
  the game. Site photos keep their existing lightbox; game icons are excluded.
- A stable, unclipped HUD sits outside the action. Desktop play scales to the
  available height. Short landscape screens put the HUD/controls beside the
  canvas; portrait retains the familiar three buttons below it.
- A tiny pre-existing gallery-heading overflow at 320px is fixed by wrapping.
  All other non-game content, photos, layout, social metadata, noindex/nofollow,
  domains and hosting configuration remain unchanged.
- Audio starts only with user interaction; sound on/off is retained. Closed
  audio contexts are safely discarded, including during local hot reloads.

## Validation

- TypeScript and the vinext/Vite production build pass.
- 24 regression groups pass, including required-item respawn after each power,
  every checkpoint across all routes, interactives, shield hit consumption,
  magnet exclusions, bike traversal/expiry, replay accounting and flight finishes.
- 24 complete control-driven simulations: six original-level regressions plus
  six per route, at 30/60 fps with three seeds. All finish without a death.
- 48 ordinary blue-truck approaches cover both directions, jump timing and
  frame rates.
- Two full browser adventures (six completed route runs) verify sequential
  map unlocking, level results, Golden Mango, secrets, final adventure totals
  and stamps. Local QA's route driver supplies ordinary controls; it does not
  change simulation state. Separate scenario buttons are development-only.
- Direct browser pointer-hold tests verify continuous direction, release to
  stop, Cha Yen hold-to-rise/release-to-descend, and the delivery bike. No text
  selection was produced. The stale-direction issue found during these tests
  was fixed and the same checks repeated successfully.
- Browser layouts checked at 320, 375, 390, 430, 768 and 1366px, plus 844×390
  and 667×375 landscape. No horizontal page overflow, clipped HUD, or controls
  outside the viewport; controls are at least 56×56px.
- Visual inspection covers all sprite cutouts, mobile food icons, three route
  environments, rider, Khao/7-Eleven, Golden Mango, map and celebrations.
- These are browser viewport/input checks, not physical iPhone/Android testing.
  Device-specific long-press behavior should still be checked on an actual phone.
- Deployment checks follow publishing: HTTPS/custom domain, page/game load,
  new public assets, production QA exclusion, photo lightbox, invitation link
  and preserved robots/Open Graph metadata.

## Original artwork and approved cleanup

Exact image-generation prompts, references and untouched source paths are in
BUFFALO-BOY-ADVENTURE-ART.md. Generation used the built-in image tool only.

The user explicitly approved removing the baked checkerboard backgrounds.
scripts/prepare-adventure-art.ps1 separates sprites with tight crop bounds and
edge-connected neutral-background removal, preserving the colored artwork and
outlined white details. The mountain opening is separately cleared. Original
generated files remain untouched outside the Site. The three scenery rows use
quality-89 JPEG; PNG sprites retain alpha. scripts/check-adventure-art.ps1
creates a green-backed inspection sheet outside the Site's public assets.

No extra engine, analytics, account system or external game/audio service was
added. Existing Sites source/build/publish workflow is retained.
