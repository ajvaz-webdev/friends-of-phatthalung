import type { GameState } from './engine';

export const STAMPS = ['Golden Mango', 'All Mangoes', 'No Falls', 'Secret Route', 'Super Buffalo', 'Speed Delivery'] as const;
export type Stamp = typeof STAMPS[number];
export type LevelResult = { level: number; mangoes: number; total: number; secrets: number; secretTotal: number; seconds: number; gold: boolean; bonus: number; stamps: Stamp[] };
export type Adventure = Array<LevelResult | null>;
export const freshAdventure = (): Adventure => [null, null, null];
export function resultFor(game: GameState): LevelResult {
  const stamps: Stamp[] = [];
  if (game.goldenMango.collected) stamps.push('Golden Mango');
  if (game.mangoCount === game.mangoes.length) stamps.push('All Mangoes');
  if (game.falls === 0 && game.deaths === 0) stamps.push('No Falls');
  if (game.secrets.length) stamps.push('Secret Route');
  if (game.powersUsed.includes('durian')) stamps.push('Super Buffalo');
  if (game.deliveryDistance >= 1800 && game.secrets.includes('delivery')) stamps.push('Speed Delivery');
  return { level: game.level.id, mangoes: game.mangoCount, total: game.mangoes.length,
    secrets: game.secrets.length, secretTotal: new Set([...game.level.secretMangoes.map(m => m.secret), ...game.level.targets.map(t => t.secret)].filter(Boolean)).size,
    seconds: game.completionTime, gold: game.goldenMango.collected, bonus: game.bonus, stamps };
}
// Replay improves a level's personal best without double-counting its mangoes.
export function recordResult(adventure: Adventure, next: LevelResult): Adventure {
  const updated = [...adventure], old = updated[next.level];
  updated[next.level] = old ? { ...next, mangoes: Math.max(old.mangoes, next.mangoes), secrets: Math.max(old.secrets, next.secrets),
    seconds: Math.min(old.seconds, next.seconds), gold: old.gold || next.gold, bonus: Math.max(old.bonus, next.bonus), stamps: [...new Set([...old.stamps, ...next.stamps])] } : next;
  return updated;
}
export const isUnlocked = (adventure: Adventure, level: number) => level === 0 || Boolean(adventure[level - 1]);
export const adventureStamps = (adventure: Adventure) => STAMPS.filter(stamp => adventure.some(result => result?.stamps.includes(stamp)));
