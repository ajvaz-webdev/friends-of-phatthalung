# Buffalo Boy artwork provenance

Generated through the **built-in image-generation tool**, followed by the user's explicitly approved deterministic background cleanup. No CLI generation was used.

Production asset: `public/game/buffalo-poses-v2.png` (768 × 384 RGBA). The supplied graphic and the two generated originals remain unchanged.

Reference: `C:\Users\TheLa\AppData\Local\Temp\codex-clipboard-56d2370b-e6e6-4bc2-beb2-427bb4dd2ec4.png`

Original generation: `C:\Users\TheLa\.codex\generated_images\01a062e2-556d-7a20-a301-6544d58a319b\exec-82e2f3fa-b938-4415-a3ae-e82d0f12ca0f.png`

Final generated input to cleanup: `C:\Users\TheLa\.codex\generated_images\01a062e2-556d-7a20-a301-6544d58a319b\exec-d6584f6f-6b66-4c59-9b88-7c10be632b7c.png`

The generator still baked in the checkerboard despite the prompt. With the user's permission, `scripts/prepare-buffalo-sprites.ps1` flood-filled connected pale neutral background pixels, preserved enclosed eye highlights, and packed the eight cutouts into transparent 192px cells. The source artwork was preserved.

## Exact final generation prompt

```text
Use case: background-extraction
Asset type: production transparent PNG game sprite sheet.
Input image 1: EDIT TARGET, the existing eight-pose buffalo sprite sheet. Preserve the artwork and character design. Do not redesign or repaint the buffalo.
Primary request: Remove the entire baked-in pale gray and white checkerboard background and make those areas genuinely TRANSPARENT using an actual PNG alpha channel (RGBA), including all gaps between legs, horns, ears, and tail. Transparent pixels must have alpha zero. Do not draw or simulate a checkerboard, white background, or any other backdrop. This is a cutout/extraction task, not a new illustration.

Also repair the packing while preserving all eight poses in the same order: use a precise 4-column × 2-row equal-square-cell layout on a 2048×1024 canvas, each cell 512×512. Scale all buffalo uniformly a little smaller, preserving the same anatomical scale across the eight sprites. Center each horizontally in its cell and position the standing/landing contact baseline at local y=430. Keep each full silhouette, including victory horns and raised forelegs, entirely within its own cell with at least 35 pixels clear padding to every edge. The victory pose must NOT intrude into the top row. Jump/fall poses should have clear air beneath their hooves. Remove only the few detached black startle ticks surrounding the hurt buffalo; keep its surprised face. Do not add anything.

Preserve: same friendly stocky charcoal Thai water buffalo, huge cream curved horns, broad muzzle, short sturdy legs, all right-facing, same crisp pixel-art shading, color palette, dark outlines, and all eight existing poses. Frame order remains top row idle, walk A, walk B, tucked-leg jump; bottom row falling, landing squat, startled hurt, happy rear-up victory.
Output: ONE true transparent-alpha PNG sprite sheet. No background, no painted checkerboard, no shadows, no ground, no labels, no borders, no effects, no new objects. The ONLY opaque pixels should belong to the eight buffalo.
```
