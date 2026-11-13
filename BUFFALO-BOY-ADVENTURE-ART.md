# Adventure art generation provenance

These are the exact three final prompts used with the built-in image-generation tool for the expanded Buffalo Boy adventure asset set. Source output files are the original generated images, before the separately approved background cleanup.

## 1. Environment sheet

Generated source output:

`C:\Users\TheLa\.codex\generated_images\01a062e2-556d-7a20-a301-6544d58a319b\exec-56fdd8d0-5866-478f-9277-184b338e7269.png`

Reference images, in order:

1. `C:\Users\TheLa\AppData\Local\Temp\codex-clipboard-99ecbe1d-91d1-4848-87f2-cb0e09437ec7.png`
2. `C:\Users\TheLa\Documents\Codex\2026-08-27\phatthalung-friends-site\outputs\phatthalung-friends\public\game\buffalo-poses-v2.png`

```text
Use case: stylized-concept
Asset type: three-level side-scrolling game background environment sheet, coordinated with the existing Buffalo Boy sprites.
Input images: Image 1 is visual style and southern-Thai-place reference only, not a poster to reproduce. Image 2 is the existing buffalo sprite atlas, for matching its crisp pixel rendering, warm muted palette, dark outlined forms, and shading language; do not put buffalo into this environment asset.

Primary request: ONE landscape bitmap environment sheet containing exactly THREE equal-height full-width horizontal panorama rows stacked directly top-to-bottom. Target full canvas 2304×1536, each row 2304×512. No gutters, borders, labels, or separators. Each row is an independent wide scene from sky at its top to open playable foreground at its bottom, NOT three depth bands of one single scene. All three rows have the same side-scroller orthographic camera and consistent scale. Design each row's far left and far right to connect approximately when repeated horizontally, with similar terrain heights, colors, and uncluttered edge composition.

TOP ROW — sunny southern Thailand rice-field countryside: soft blue sky with small warm clouds, low distant layered green-blue mountains, yellow-green rice paddies with irrigation water, scattered coconut palms, modest timber houses and thatched farm shelters at mid-distance. Small varied mountain silhouettes only: NO giant central mountain, NO massive isolated limestone tower, NO prominent Khao Ok Thalu landmark, as that will be drawn separately in the game. A calm sunlit pale-earth/grass foreground strip stays open across the bottom.

MIDDLE ROW — Thale Noi wetlands: luminous blue-green water, clusters of pink lotus and green lily pads, reeds, modest wooden fishing huts on posts, a few low landing decks and fishing structures, distant misty low hills and palms, soft fresh morning sky. Lotus and reeds are mainly mid-distance and at the lower margins, leaving a readable uncluttered foreground band for gameplay.

BOTTOM ROW — warm sunset southern Thai town: warm apricot sky, low small-town storefronts with varied timber and plaster facades, corrugated roofs, striped awnings, welcoming food stalls and fruit displays, a few distant parked motorcycles, modest street lamps. Blank signboards only, no writing. Buildings stay in the middle distance and an open quiet horizontal street runs across the lower foreground.

Style/medium: polished warm retro pixel art, matching the reference game graphic and existing buffalo sprites; crisp stepped pixel edges, clear clusters, subtle controlled dithering, rich but limited muted green, ochre, teal, warm stone, and sunset palettes. Moderate detail, coherent scale, legible broad silhouettes when scaled down. Not painterly, not blurry, not smooth vector art, not photorealistic. In each row the ground/water horizon is in the lower half, around 60–68 percent of that row's height. Keep bottom foreground areas uncluttered, without big objects that obstruct an overlaid player.

Constraints: scenery only. NO people, NO animals, NO buffalo, NO chickens, NO geese, NO character silhouettes, NO floating collectibles, NO UI, NO text, NO labels, NO lettering, NO numbers, NO logos, NO frames, NO borders, NO watermark. No central hero composition; these are production scrolling background strips, not a poster. Exactly three equally sized full-width panoramas.
```

## 2. Twenty-four-sprite atlas

Generated source output:

`C:\Users\TheLa\.codex\generated_images\01a062e2-556d-7a20-a301-6544d58a319b\exec-b4e7b6f6-fd4d-4cd1-9f60-a165d37dc248.png`

Reference images, in order:

1. `C:\Users\TheLa\AppData\Local\Temp\codex-clipboard-99ecbe1d-91d1-4848-87f2-cb0e09437ec7.png`
2. `C:\Users\TheLa\Documents\Codex\2026-08-27\phatthalung-friends-site\outputs\phatthalung-friends\public\game\buffalo-poses-v2.png`

```text
Use case: stylized-concept
Asset type: production pixel-art sprite atlas for the Buffalo Boy southern Thailand side-scrolling game.
Input images: Image 1 is STYLE AND SUBJECT REFERENCE only: warm retro pixel art, Thai food, vehicles, village objects, friendly characters. Do not reproduce its poster or layout. Image 2 is the EXISTING BUFFALO IDENTITY AND PIXEL-STYLE REFERENCE: use exactly that charcoal stocky water buffalo design for the delivery rider, including huge pale curved horns, broad muzzle, expressive eyes, short sturdy limbs and warm muted shading. All atlas subjects should look like assets from this same game.

Primary request: ONE PNG sprite atlas with a genuinely TRANSPARENT ALPHA CHANNEL, exactly SIX columns by FOUR rows, TWENTY-FOUR separate game sprites. Target full canvas 2304×1536, each cell 384×384, no visible grid. All 24 cells are equal square cells. Every sprite is fully contained within its own cell, centered horizontally, with at least 48 pixels of completely transparent margin around every part. No object may touch or cross a cell boundary. For each item, uniformly fit its entire silhouette into the middle 70–75 percent of its cell. Smaller collectible food icons may have more padding. Full-body people all share the same anatomical scale and foot baseline at 82 percent of cell height. Do not allow tall palm leaves, horns, straw, skewers, roof peaks or heads to extend into adjacent cells. One asset per cell; no combined scenes except the explicitly combined delivery rider.

Exact row-major layout, left to right:
ROW 1:
1. one ripe yellow mango with a little green leaf;
2. one whole spiky green-gold durian;
3. one clear orange Thai iced-tea cup with a sealed lid and straw;
4. one Mala grilled-meat skewer, appetizing reddish-brown seasoned meat pieces;
5. one white plate of Thai mango sticky rice, yellow mango slices beside white sticky rice;
6. one Moo Ping grilled-pork skewer, golden-brown caramelized pieces.

ROW 2:
1. one red-and-white KFC fried-chicken bucket with visible fried chicken and the exact clear letters "KFC" on its front, no other text;
2. one opened young green coconut with pale cut top and a straw;
3. one colorful Thai layered khanom sweet, neatly stacked soft pastel green, pink and cream layers;
4. one friendly plump white chicken, red comb, golden beak and feet, full body, facing right;
5. one friendly white goose, long neck, orange beak and feet, full body, facing right, clearly distinct from the chicken;
6. the SAME buffalo from Image 2 RIDING a green delivery motorbike, with forehooves at handlebars and body seated astride, both wheels visible, a square green delivery box attached behind the buffalo. This is one combined rider-and-bike sprite facing right; keep all horns, hooves, wheels and box within the cell. No human rider. No lettering on the box.

ROW 3:
1. one blue pickup truck, full vehicle with both wheels visible, right-facing side view;
2. one green motorcycle without a rider, full vehicle, right-facing side view;
3. one wheeled wooden fruit cart filled with colorful mangoes and tropical fruit, no vendor;
4. one coconut palm with full trunk, coconuts and entire crown visible, no ground patch;
5. one modest southern Thai wooden house with warm timber walls, pitched roof and small porch, entire structure visible, no people;
6. one welcoming fruit stall with wooden counter, simple striped awning and neatly stacked colorful fruit, no vendor.

ROW 4: six distinct friendly full-body adult townspeople, respectful everyday clothing, general character archetypes, NOT portraits or likenesses of real people. Relaxed idle standing poses, hands visible, front-three-quarter viewpoint slightly toward the right, warm welcoming expressions:
1. short dark-haired woman wearing glasses and a teal outfit;
2. long-haired woman wearing a cream blouse and orange skirt;
3. older silver-haired woman wearing a blue floral dress;
4. bearded man wearing glasses and a burgundy checked shirt with trousers;
5. dark-skinned woman wearing a blue-and-white dress;
6. man wearing a white shirt and dark trousers.

Style/medium: crisp polished higher-resolution retro pixel art exactly coherent with the buffalo reference. Clean stepped pixel silhouettes, dark pixel outlines, small controlled color ramps, warm muted rich palette, clustered highlights and restrained dithering, expressive readable shapes for gameplay. Orthographic side-view vehicles and animals; friendly front-threequarter food, people and structures. Pixel shading, not soft painterly illustration, not vector-smooth cartoons, not photorealistic. Keep all outlines and white sprite details opaque.

Background/output: actual RGBA PNG transparency with zero-alpha empty space, including gaps inside and between the sprites. NO painted checkerboard pattern, NO white rectangle, NO gray rectangle, NO colored backdrop. Only the listed sprite artwork should be opaque. No ground plane, ground patches, cast shadows, scenery, particles, stars, frames, borders, cell lines, labels, numbers, UI, watermark, names, or additional text. The ONLY permitted letters anywhere are "KFC" on the bucket in row 2 column 1. Exactly 24 sprites in the specified order, no missing or extra assets.
```

## 3. Landmark-and-prop atlas

Generated source output:

`C:\Users\TheLa\.codex\generated_images\01a062e2-556d-7a20-a301-6544d58a319b\exec-51ba6f13-5d19-428e-98a2-2b01b2f44830.png`

Reference images, in order:

1. `C:\Users\TheLa\.codex\generated_images\01a062e2-556d-7a20-a301-6544d58a319b\exec-b4e7b6f6-fd4d-4cd1-9f60-a165d37dc248.png`
2. `C:\Users\TheLa\AppData\Local\Temp\codex-clipboard-99ecbe1d-91d1-4848-87f2-cb0e09437ec7.png`

```text
Use case: stylized-concept
Asset type: six isolated landmark-and-prop sprites for the same Buffalo Boy southern Thailand pixel-art game.
Input images: Image 1 is the existing game sprite atlas, used ONLY as a rendering, palette and outline reference; do not reproduce its objects or checkerboard. Image 2 is the game concept/reference poster, used ONLY for the warm southern Thai setting and the Khao Ok Thalu limestone landmark. This is a new asset sheet, not a poster edit.

Primary request: Generate ONE production PNG atlas with exactly THREE columns and TWO rows of equal square cells, target canvas 1536×1024 with 512×512 cells. Six total isolated sprites in the exact order below. Every complete silhouette must fit entirely within the middle 70 percent of its cell with roomy clear gutters and at least 60 pixels padding on every side. No elements touching or crossing cell boundaries. Center each sprite horizontally and put its bottom at roughly 82 percent of its own cell height. Different objects may be scaled independently to fit these cells. No visible grid.

TOP ROW, left to right:
1. Khao Ok Thalu limestone mountain landmark from Phatthalung: one complete steep, craggy gray-tan limestone massif, uneven vertical rock faces, green tropical vegetation clinging to ledges and its compact base, with a distinctive SMALL natural opening near the upper peak. The hole should read as a real small opening through the rock, not a giant arch. Show the whole isolated mountain from peak to base inside its cell. No sky, landscape panel, ground tile, village, or detached trees.
2. A modest Thai 7-Eleven convenience-store storefront, complete small single-story building in friendly front-threequarter view. Clearly recognizable original green, orange and red horizontal stripe bands across its white fascia and one small sign reading exactly "7 ELEVEN". Glass entrance and windows, restrained warm architectural detail. No people, vehicles, surrounding scenery or other lettering.
3. A welcoming modest Kingdom Hall storefront/building in a southern Thai town, complete small low-rise building with a simple pitched roof, light warm walls, welcoming glass entrance and windows. One blue square sign with exact white letters "JW.ORG". Respectful simple community-building appearance, no spires or unrelated religious symbols, no people, no other lettering or surrounding scenery.

BOTTOM ROW, left to right:
1. A friendly small brown dog, full body, warm chestnut coat, floppy ears, expressive kind eyes, short sturdy legs, gently curled or raised tail, standing in right-facing side/threequarter view. No accessories or ground.
2. One golden rectangular bound hay bale, chunky straw texture and two dark binding bands, readable in front-threequarter view, full isolated silhouette, no loose background straw or ground.
3. One simple wooden irrigation gate: exactly two sturdy vertical timber posts and a lifted horizontal timber-slat panel between them, with clear open passage below the raised panel, modest wooden bracing/mechanism. The complete gate is inside the cell, front/side-game readable view, no water, banks, terrain patch, people or scenery.

Style/medium: same crisp rich warm retro pixel art as Image 1: dark stepped pixel outlines, clean chunky pixel clusters, warm muted color ramps, controlled textured shading, restrained dithering, polished readable silhouettes. Not painterly, not blurry, not photorealistic, not smooth vector graphics. Match the existing atlas's object detail and friendly game-art proportions.

Output/background: genuinely transparent RGBA PNG, alpha-zero empty space around and inside the isolated silhouettes, including the mountain opening and gate passage. Do NOT paint a checkerboard, white backdrop, gray backdrop, colored rectangle, ground plane, cast shadow, border, grid, label, caption or watermark. Only these six sprites should be opaque. The ONLY text permitted is "7 ELEVEN" on the store sign and "JW.ORG" on the blue hall sign. Preserve all artwork edges and all white building/sign details.
```
