import type { PowerKind } from './engine';

export const POWER_ART: Record<PowerKind, string> = { durian: 'durian', flight: 'tea', fire: 'mala', double: 'stickyRice', bike: 'bucket', shield: 'coconut', magnet: 'khanom' };
const names = ['mango', 'durian', 'tea', 'mala', 'stickyRice', 'mooPing', 'bucket', 'coconut', 'khanom', 'chicken', 'goose', 'rider', 'pickup', 'motorbike', 'fruitCart', 'palm', 'house', 'fruitStall', 'person0', 'person1', 'person2', 'person3', 'person4', 'person5', 'mountain', 'sevenEleven', 'hall', 'dog', 'hay', 'irrigation'];
const images: Record<string, HTMLImageElement> = {};
const backgrounds: HTMLImageElement[] = [];
export function loadArt() {
  const pending: Promise<void>[] = [];
  const prepare = (image: HTMLImageElement, url: string) => {
    pending.push(new Promise<void>((resolve, reject) => {
      if (image.complete && image.naturalWidth) { resolve(); return; }
      image.onload = () => resolve(); image.onerror = () => reject(new Error('Game artwork did not load'));
      image.src = url;
    }));
  };
  for (const name of names) {
    const image = images[name] ?? new Image(); images[name] = image;
    prepare(image, '/game/' + name + '.png');
  }
  for (let i = 0; i < 3; i++) { const image = backgrounds[i] ?? new Image(); backgrounds[i] = image; prepare(image, '/game/route-' + i + '.jpg'); }
  return Promise.all(pending);
}
// Bottom-centered sprites with their aspect ratios preserved. Pixel snapping
// avoids shimmer as the camera moves; no per-frame image decoding or filters.
export function sprite(ctx: CanvasRenderingContext2D, name: string, x: number, y: number, width: number, height: number, flip = false) {
  const image = images[name];
  if (!image?.complete || !image.naturalWidth) return false;
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const w = Math.round(image.naturalWidth * scale), h = Math.round(image.naturalHeight * scale);
  ctx.save(); ctx.translate(Math.round(x), Math.round(y)); if (flip) ctx.scale(-1, 1);
  ctx.drawImage(image, -Math.round(w / 2), -h, w, h); ctx.restore(); return true;
}
export function panorama(ctx: CanvasRenderingContext2D, level: number, camera: number) {
  const image = backgrounds[level];
  if (!image?.complete || !image.naturalWidth) return false;
  const width = 2640, height = 590, offset = -(camera * .19) % width;
  for (let i = -1; i < 2; i++) {
    // Mirror adjoining strips: scenery meets exactly at each seam.
    const tile = Math.floor(camera * .19 / width) + i;
    ctx.save(); ctx.translate(Math.round(offset + i * width), 0);
    if (Math.abs(tile % 2) === 1) { ctx.translate(width, 0); ctx.scale(-1, 1); }
    ctx.drawImage(image, 0, 0, width, height); ctx.restore();
  }
  return true;
}
export function irrigationGate(ctx: CanvasRenderingContext2D, x: number, y: number, lift: number) {
  const image = images.irrigation;
  if (!image?.complete || !image.naturalWidth) return;
  // Keep the timber posts planted while the slatted middle lifts clear.
  ctx.drawImage(image, 0, 0, 66, 278, Math.round(x - 53), y - 150, 36, 150);
  ctx.drawImage(image, 270, 0, 105, 298, Math.round(x + 29), y - 150, 53, 150);
  ctx.drawImage(image, 68, 46, 201, 113, Math.round(x - 33), Math.round(y - 134 - lift), 66, 114);
}
// A tiny cut-sprite rig gives each guest independent waving/clapping arms.
// These are runtime animation transforms of the original art, not new drawings.
export function person(ctx: CanvasRenderingContext2D, index: number, x: number, y: number, width: number, height: number, action: 'idle' | 'wave' | 'clap' | 'raise', time: number) {
  const image = images['person' + index];
  if (!image?.complete || !image.naturalWidth) return;
  const w = image.naturalWidth, h = image.naturalHeight, scale = Math.min(width / w, height / h);
  ctx.save(); ctx.translate(Math.round(x - w * scale / 2), Math.round(y - h * scale)); ctx.scale(scale, scale);
  const top = Math.round(h * .43), bottom = Math.round(h * .78), armW = Math.round(w * .19);
  ctx.drawImage(image, 0, 0, w, top, 0, 0, w, top);
  ctx.drawImage(image, armW, top, w - armW * 2, bottom - top, armW, top, w - armW * 2, bottom - top);
  ctx.drawImage(image, 0, bottom, w, h - bottom, 0, bottom, w, h - bottom);
  for (const right of [false, true]) {
    const sourceX = right ? w - armW : 0, pivotX = right ? w - armW : armW;
    const wave = Math.sin(time * 7);
    const angle = action === 'idle' ? 0 : action === 'raise' ? (right ? -2.3 : 2.3) : action === 'clap' ? (right ? .55 + wave * .3 : -.55 - wave * .3) : right ? -2 + wave * .35 : 0;
    ctx.save(); ctx.translate(pivotX, top); ctx.rotate(angle);
    ctx.drawImage(image, sourceX, top, armW, bottom - top, right ? 0 : -armW, 0, armW, bottom - top); ctx.restore();
  }
  ctx.restore();
}
