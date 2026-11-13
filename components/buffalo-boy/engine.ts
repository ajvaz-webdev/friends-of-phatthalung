// The existing Canvas level, with a deterministic, independently testable simulation.
import { EXTRA_LEVELS } from './levels.ts';
export const VIEW_WIDTH = 960;
export const VIEW_HEIGHT = 720;
export const WORLD_WIDTH = 22400;
export const GROUND_Y = 584;
// Horns and tail are visual only: collisions use the forgiving torso.
export const PLAYER_WIDTH = 56;
export const PLAYER_HEIGHT = 60;
export const MAX_SPEED = 250;
export const SUPER_SPEED = 390;
export const ACCELERATION = 1050;
export const DECELERATION = 1320;
export const GRAVITY = 1450;
export const JUMP_SPEED = 640;
export const COYOTE_TIME = .15;
export const JUMP_BUFFER = .18;
export const FINISH_X = 21830;
export const SECRET_TOTAL = 4;
export type GameMode = 'intro' | 'playing' | 'paused' | 'won' | 'map';
export type Sfx = 'jump' | 'mango' | 'stomp' | 'splash' | 'hurt' | 'checkpoint' | 'victory' | 'durian' | 'mooPing' | 'smash' | 'switch' | 'flight' | 'fire' | 'double' | 'golden' | 'fireball' | 'encouragement' | 'secret' | 'bike' | 'shield' | 'magnet' | 'shieldBreak' | 'engine' | 'levelFinish';
export type Controls = { left: boolean; right: boolean; jumpHeld: boolean; jumpPressed: boolean };
export type PowerKind = 'durian' | 'flight' | 'fire' | 'double' | 'bike' | 'shield' | 'magnet';
export const POWER_META: Record<PowerKind, { label: string; instruction: string; duration: number; color: string }> = {
  durian: { label: 'SUPER BUFFALO', instruction: 'Charge through hay · higher jumps', duration: 10, color: '#ffe270' },
  flight: { label: 'CHA YEN FLIGHT', instruction: 'Hold JUMP to rise · release to float', duration: 9, color: '#ffba70' },
  fire: { label: 'MALA FIRE', instruction: 'Fireballs find nearby targets for you', duration: 10, color: '#ff8b69' },
  double: { label: 'DOUBLE JUMP', instruction: 'Press JUMP again in the air', duration: 12, color: '#f9eec3' },
  bike: { label: 'DELIVERY BIKE', instruction: 'Steer · JUMP to hop · roll over small crates', duration: 10, color: '#aee199' },
  shield: { label: 'COCONUT SHIELD', instruction: 'One hit protected · water still needs a bridge', duration: 30, color: '#a7e2df' },
  magnet: { label: 'KHANOM MAGNET', instruction: 'Nearby mangoes come to you', duration: 10, color: '#f1b7d1' },
};
export const CHECKPOINTS = [
  { x: 220, name: 'Start' }, { x: 4200, name: 'Rice Fields' },
  { x: 11180, name: 'Khao Ok Thalu' }, { x: 13480, name: 'Wetlands' },
  { x: 17950, name: 'Sunset Village' }, { x: 20700, name: 'Final Approach' },
];
export type SceneryKind = 'buffalo' | 'house' | 'palm' | 'mangoTree' | 'fruitStand' | 'motorbike' | 'pickup' | 'hay' | 'sign' | 'shelter' | 'lotus' | 'tuktuk' | 'people' | 'mooPingStand' | 'farmer' | 'dog' | 'building';
export type Player = { x: number; y: number; vx: number; vy: number; facing: 1 | -1; grounded: boolean; coyote: number; jumpBuffer: number; hurtTimer: number; landTimer: number; animation: number; airJumps: number; doubleTimer: number; knockback: number };
export type Mango = { x: number; y: number; collected: boolean; hidden?: boolean; secret?: string };
export type SpecialPickup = { x: number; y: number; collected: boolean };
export type PowerPickup = SpecialPickup & { kind: PowerKind; id: string };
export type ChickenBehavior = 'walk' | 'sleep' | 'dash' | 'guard' | 'pace';
export type Chicken = { x: number; y: number; originX: number; dir: 1 | -1; active: boolean; bounce: number; behavior: ChickenBehavior; alert: number };
export type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; size: number };
export type Platform = { x: number; y: number; width: number; kind: 'earth' | 'wood' | 'hay' };
export type Scenery = { x: number; kind: SceneryKind; variant?: number };
export type Breakable = { x: number; y: number; width: number; height: number; kind: 'hay' | 'crate'; active: boolean; secret?: string };
export type Gate = { x: number; leverX: number; switchY: number; open: boolean; lift: number };
export type MovingActor = { x: number; y: number; minX: number; maxX: number; width: number; height: number; hitWidth?: number; hitHeight?: number; speed: number; dir: 1 | -1; kind: 'fruitCart' | 'pickup' | 'buffalo' | 'motorbike'; active: boolean; knocked: number; pause: number };
export type Coconut = { x: number; y: number; vy: number; timer: number; triggered: boolean; landed: boolean };
export type BridgeBoard = { x: number; y: number; width: number; timer: number; drop: number };
export type Target = { x: number; y: number; active: boolean; secret: string };
export type CheckpointSnapshot = {
  powerups: PowerPickup[]; mooPings: SpecialPickup[]; breakables: Breakable[];
  gates: Gate[]; movers: MovingActor[]; coconuts: Coconut[];
  bridgeBoards: BridgeBoard[]; chickens: Chicken[]; targets: Target[];
};
export type GameState = {
  level: LevelDefinition; powersUsed: PowerKind[]; falls: number; deliveryDistance: number; bikeSoundTimer: number; scenicTimer: number; scenicSeen: boolean;
  player: Player; cameraX: number; mangoes: Mango[]; chickens: Chicken[]; particles: Particle[];
  mangoCount: number; lives: number; checkpoint: number; snapshot: CheckpointSnapshot | null;
  powerups: PowerPickup[]; mooPings: SpecialPickup[]; breakables: Breakable[]; gates: Gate[];
  movers: MovingActor[]; coconuts: Coconut[]; bridgeBoards: BridgeBoard[];
  power: { kind: PowerKind; remaining: number } | null; superTimer: number;
  fireCooldown: number; fireballs: Array<{ x: number; y: number; vx: number; vy: number; life: number }>;
  targets: Target[]; secrets: string[]; goldenMango: SpecialPickup; bonus: number; rewardedMeals: number[];
  milestones: number[]; encouragement: { thai: string; roman: string; remaining: number } | null;
  hitStop: number; finishTimer: number; completionTime: number; deaths: number; cosmeticSeed: number;
  eatTimer: number; message: string; messageTimer: number; elapsed: number; visualTime: number;
};
export type LevelDefinition = {
  id: number; name: string; subtitle: string; worldWidth: number; finishX: number;
  checkpoints: { x: number; name: string }[]; canals: { start: number; end: number }[]; platforms: Platform[];
  mangoSeeds: Array<[number, number, boolean?]>; secretMangoes: Mango[];
  powerSeeds: Array<[PowerKind, number, number]>; meals: Array<[number, number]>; chickenSeeds: number[];
  breakables: Array<Omit<Breakable, 'active'>>; gates: Array<Omit<Gate, 'open' | 'lift'>>;
  movers: Array<Omit<MovingActor, 'active' | 'knocked' | 'pause'>>; coconuts: number[];
  bridgeStart: number; bridgeY: number; bridgeCount: number; targets: Target[];
  mud: { start: number; end: number }[]; puddles: { x: number; width: number }[];
  scenery: Scenery[]; sections: { until: number; name: string }[];
};
export const CANALS = [
  { start: 4480, end: 4820 },
  { start: 5160, end: 5480 },
  { start: 13920, end: 14420 },
  { start: 15120, end: 15660 },
];

export const PLATFORMS: Platform[] = [
  { x: 4400, y: 574, width: 520, kind: 'wood' },
  { x: 5120, y: 556, width: 430, kind: 'wood' },
  { x: 6260, y: 526, width: 380, kind: 'earth' },
  { x: 6800, y: 494, width: 320, kind: 'hay' },
  { x: 7330, y: 448, width: 300, kind: 'earth' },
  { x: 7830, y: 402, width: 360, kind: 'wood' },
  { x: 8340, y: 474, width: 330, kind: 'hay' },
  { x: 9180, y: 520, width: 400, kind: 'earth' },
  { x: 13810, y: 548, width: 760, kind: 'wood' },
  { x: 14710, y: 510, width: 300, kind: 'wood' },
  { x: 15020, y: 548, width: 760, kind: 'wood' },
  { x: 15880, y: 515, width: 320, kind: 'earth' },
  { x: 8090, y: 286, width: 260, kind: 'wood' },
  { x: 10120, y: 324, width: 280, kind: 'earth' },
];

export const MANGO_SEEDS: Array<[number, number, boolean?]> = [
  [560, 520], [860, 500], [1190, 514], [1550, 476], [1900, 518],
  [2440, 506], [2810, 488], [3230, 510], [3650, 478], [4100, 516],
  [4540, 506], [4680, 492], [5260, 485], [5410, 472], [5840, 510],
  [6370, 460], [6900, 426], [7420, 382], [7920, 330, true], [8040, 320, true],
  [8160, 338, true], [8470, 405], [9280, 455], [9720, 510], [10240, 482],
  [10820, 454], [11430, 500], [12140, 488], [12630, 466], [13220, 510],
  [14020, 482], [14200, 466], [14840, 444], [15240, 478], [15460, 462],
  [16000, 446], [16540, 502], [17150, 476], [17820, 504], [18460, 470],
  [19110, 500], [19800, 478], [20420, 510], [21120, 486], [21620, 504],
];


export const CHICKEN_SEEDS = [2860, 3820, 5690, 7700, 8900, 13220, 16180, 17480, 20260];
export const POWER_SEEDS: Array<[PowerKind, number, number]> = [
  ['durian', 1920, 535], ['durian', 5500, 510], ['flight', 6740, 530],
  ['double', 8980, 530], ['flight', 9760, 526], ['durian', 11370, 530],
  ['fire', 12740, 530], ['flight', 13580, 524], ['double', 15800, 530],
  ['durian', 16350, 520], ['durian', 18120, 530], ['fire', 19520, 530], ['double', 20820, 530],
];
export const MOO_PING_SEEDS: Array<[number, number]> = [[3380, 510], [12690, 505], [17620, 502]];
export const MUD_PATCHES = [{ start: 9200, end: 9880 }, { start: 16440, end: 17080 }];
export const RAIN_PUDDLES = [{ x: 13730, width: 140 }, { x: 14880, width: 105 }, { x: 15810, width: 150 }];
export const BREAKABLE_SEEDS: Array<Omit<Breakable, 'active'>> = [
  { x: 2070, y: GROUND_Y, width: 92, height: 66, kind: 'hay', secret: 'durian' },
  { x: 5980, y: GROUND_Y, width: 88, height: 66, kind: 'hay' },
  { x: 6550, y: GROUND_Y, width: 78, height: 62, kind: 'crate' },
  { x: 8420, y: 474, width: 86, height: 66, kind: 'hay' },
  { x: 18880, y: GROUND_Y, width: 90, height: 68, kind: 'hay' },
  { x: 20280, y: GROUND_Y, width: 76, height: 62, kind: 'crate' },
];
export const GATE_SEEDS = [{ x: 5750, leverX: 5610, switchY: 564 }, { x: 14660, leverX: 14520, switchY: 528 }];
export const MOVER_SEEDS: Array<Omit<MovingActor, 'active' | 'knocked' | 'pause'>> = [
  { x: 7420, y: GROUND_Y, minX: 7260, maxX: 7760, width: 122, height: 76, speed: 38, dir: 1, kind: 'fruitCart' },
  { x: 11880, y: GROUND_Y, minX: 11660, maxX: 12220, width: 142, height: 64, hitWidth: 84, hitHeight: 42, speed: 36, dir: -1, kind: 'pickup' },
  { x: 15920, y: GROUND_Y, minX: 15800, maxX: 16380, width: 126, height: 60, speed: 28, dir: 1, kind: 'buffalo' },
  { x: 16240, y: GROUND_Y, minX: 16180, maxX: 16420, width: 126, height: 60, speed: 22, dir: -1, kind: 'buffalo' },
  { x: 17360, y: GROUND_Y, minX: 17140, maxX: 17840, width: 92, height: 54, hitWidth: 48, hitHeight: 34, speed: 45, dir: -1, kind: 'motorbike' },
];
export const COCONUT_SEEDS = [1060, 10340, 16620];


export const SCENERY: Scenery[] = [
  { x: 520, kind: 'buffalo', variant: 0 }, { x: 1040, kind: 'palm', variant: 0 },
  { x: 1650, kind: 'mangoTree', variant: 0 }, { x: 2320, kind: 'house', variant: 0 },
  { x: 2700, kind: 'farmer', variant: 0 }, { x: 2870, kind: 'motorbike', variant: 0 }, { x: 3340, kind: 'mooPingStand', variant: 0 },
  { x: 3860, kind: 'pickup', variant: 0 }, { x: 4260, kind: 'sign', variant: 0 },
  { x: 5000, kind: 'palm', variant: 1 }, { x: 5750, kind: 'house', variant: 1 },
  { x: 6480, kind: 'hay', variant: 0 }, { x: 7060, kind: 'buffalo', variant: 1 },
  { x: 7520, kind: 'mangoTree', variant: 1 }, { x: 8500, kind: 'hay', variant: 1 },
  { x: 9360, kind: 'sign', variant: 1 }, { x: 10300, kind: 'palm', variant: 2 },
  { x: 11240, kind: 'buffalo', variant: 2 }, { x: 12450, kind: 'shelter', variant: 0 },
  { x: 13160, kind: 'people', variant: 0 }, { x: 13860, kind: 'lotus', variant: 0 },
  { x: 14520, kind: 'lotus', variant: 1 }, { x: 15320, kind: 'lotus', variant: 2 },
  { x: 16020, kind: 'palm', variant: 3 }, { x: 16840, kind: 'house', variant: 2 },
  { x: 17440, kind: 'mooPingStand', variant: 1 }, { x: 18120, kind: 'tuktuk', variant: 0 },
  { x: 18780, kind: 'pickup', variant: 1 }, { x: 19300, kind: 'motorbike', variant: 1 },
  { x: 19880, kind: 'people', variant: 1 }, { x: 20140, kind: 'dog', variant: 0 }, { x: 20540, kind: 'house', variant: 3 },
  { x: 21020, kind: 'mangoTree', variant: 2 }, { x: 21800, kind: 'building', variant: 0 },
];

export const SECTION_NAMES = [
  { until: 2300, name: 'Morning Rice Fields' },
  { until: 4400, name: 'Village Road' },
  { until: 6100, name: 'Irrigation Crossing' },
  { until: 9000, name: 'Rice Field Platforms' },
  { until: 12100, name: 'Khao Ok Thalu' },
  { until: 13350, name: 'Checkpoint Shelter' },
  { until: 16250, name: 'Thale Noi Wetlands' },
  { until: 19350, name: 'Sunset Countryside' },
  { until: 21650, name: 'Final Village Approach' },
  { until: WORLD_WIDTH, name: 'A Warm Welcome' },
];


export const SECRET_MANGOES: Mango[] = [
  { x: 2200, y: 520, collected: false, hidden: true, secret: 'durian' },
  { x: 2330, y: 496, collected: false, hidden: true, secret: 'durian' },
  ...[7410, 7590, 7770, 7970, 8210].map((x, i) => ({ x, y: 230 - i * 8, collected: false, secret: 'flight' })),
  { x: 9360, y: 280, collected: false, secret: 'double' },
  { x: 9520, y: 275, collected: false, secret: 'double' },
  { x: 13030, y: 514, collected: false, hidden: true, secret: 'fire' },
  { x: 13120, y: 490, collected: false, hidden: true, secret: 'fire' },
];
export const MANGO_TOTAL = MANGO_SEEDS.length + SECRET_MANGOES.length;
export const LEVELS: LevelDefinition[] = [{
  id: 0, name: 'Rice Field Road', subtitle: 'Rice paddies, mountain views, and friends along the road.', worldWidth: WORLD_WIDTH, finishX: FINISH_X,
  checkpoints: CHECKPOINTS, canals: CANALS, platforms: PLATFORMS, mangoSeeds: MANGO_SEEDS, secretMangoes: SECRET_MANGOES,
  powerSeeds: POWER_SEEDS, meals: MOO_PING_SEEDS, chickenSeeds: CHICKEN_SEEDS, breakables: BREAKABLE_SEEDS, gates: GATE_SEEDS,
  movers: MOVER_SEEDS, coconuts: COCONUT_SEEDS, bridgeStart: 13810, bridgeY: 548, bridgeCount: 12,
  targets: [{ x: 13010, y: 488, active: true, secret: 'fire' }, { x: 19850, y: 475, active: true, secret: 'fire' }],
  mud: MUD_PATCHES, puddles: RAIN_PUDDLES, scenery: SCENERY, sections: SECTION_NAMES,
}, ...EXTRA_LEVELS];
export const secretTotal = (level: LevelDefinition) => new Set([...level.secretMangoes.map(m => m.secret), ...level.targets.map(t => t.secret)].filter(Boolean)).size;
export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export const isCanal = (x: number, level = LEVELS[0]) => level.canals.some(canal => x > canal.start && x < canal.end);
export const groundAt = (x: number, level = LEVELS[0]) => isCanal(x, level) ? null : GROUND_Y;
export const sectionAt = (x: number, level = LEVELS[0]) => level.sections.find(section => x < section.until)?.name ?? 'A Warm Welcome';
export const dangerousChicken = (chicken: Chicken) => chicken.behavior === 'pace' || chicken.behavior === 'guard';
export const cosmetic = (seed: number, index: number) => ((Math.sin(seed * 17.1 + index * 127.1) * 43758.5453) % 1 + 1) % 1;
export function freshPlayer(x = 220): Player {
  return { x, y: GROUND_Y, vx: 0, vy: 0, facing: 1, grounded: true, coyote: COYOTE_TIME,
    jumpBuffer: 0, hurtTimer: 0, landTimer: 0, animation: 0, airJumps: 0, doubleTimer: 0, knockback: 0 };
}
export function createGame(seed = Math.floor(Math.random() * 100000), levelIndex = 0): GameState {
  const level = LEVELS[clamp(levelIndex, 0, LEVELS.length - 1)];
  const game: GameState = {
    level, powersUsed: [], falls: 0, deliveryDistance: 0, bikeSoundTimer: 0, scenicTimer: 0, scenicSeen: false,
    player: freshPlayer(), cameraX: 0,
    mangoes: [...level.mangoSeeds.map(([x, y, hidden]) => ({ x, y, hidden, collected: false })), ...level.secretMangoes.map(m => ({ ...m }))],
    chickens: level.chickenSeeds.map((x, index) => {
      const behavior = (['walk', 'sleep', 'pace', 'dash', 'guard'] as ChickenBehavior[])[index % 5];
      const origin = x + (behavior === 'walk' || behavior === 'sleep' ? Math.round(cosmetic(seed, index) * 70 - 35) : 0);
      return { x: origin, originX: origin, y: GROUND_Y - 2, dir: index % 2 ? -1 : 1, active: true, bounce: 0, behavior, alert: 0 };
    }),
    particles: [], mangoCount: 0, lives: 3, checkpoint: 0, snapshot: null,
    powerups: level.powerSeeds.map(([kind, x, y], i) => ({ kind, x, y, id: 'power-' + i, collected: false })),
    mooPings: level.meals.map(([x, y]) => ({ x, y, collected: false })),
    breakables: level.breakables.map(item => ({ ...item, active: true })),
    gates: level.gates.map(gate => ({ ...gate, open: false, lift: 0 })),
    movers: level.movers.map(mover => ({ ...mover, active: true, knocked: 0, pause: 0 })),
    coconuts: level.coconuts.map(x => ({ x, y: GROUND_Y - 184, vy: 0, timer: 0, triggered: false, landed: false })),
    bridgeBoards: Array.from({ length: level.bridgeCount }, (_, i) => ({ x: level.bridgeStart + i * 63, y: level.bridgeY, width: 65, timer: 0, drop: 0 })),
    power: null, superTimer: 0, fireCooldown: 0, fireballs: [],
    targets: level.targets.map(t => ({ ...t })),
    goldenMango: { x: level.id === 0 ? 10270 : -2000, y: 264, collected: false }, secrets: [], bonus: 0, rewardedMeals: [],
    milestones: [], encouragement: null, hitStop: 0, finishTimer: 0, completionTime: 0,
    deaths: 0, cosmeticSeed: seed, eatTimer: 0, message: '', messageTimer: 0, elapsed: 0, visualTime: 0,
  };
  saveCheckpoint(game, 0);
  return game;
}
const clone = <T,>(value: T): T => structuredClone(value);
export function saveCheckpoint(game: GameState, index: number) {
  game.checkpoint = index;
  const { powerups, mooPings, breakables, gates, movers, coconuts, bridgeBoards, chickens, targets } = game;
  game.snapshot = clone({ powerups, mooPings, breakables, gates, movers, coconuts, bridgeBoards, chickens, targets });
  // A pickup ahead of the checkpoint must never be saved in an exhausted state.
  for (const item of game.snapshot.powerups) if (item.x >= game.level.checkpoints[index].x - 70) item.collected = false;
}
export function respawn(game: GameState, sound: (s: Sfx) => void = () => {}) {
  if (game.snapshot) Object.assign(game, clone(game.snapshot));
  const spawnX = game.level.checkpoints[game.checkpoint].x;
  game.player = { ...freshPlayer(spawnX), hurtTimer: 1.5 };
  game.cameraX = clamp(spawnX - VIEW_WIDTH * .36, 0, game.level.worldWidth - VIEW_WIDTH);
  game.power = null; game.superTimer = 0; game.fireballs = []; game.fireCooldown = 0;
  game.particles = []; game.hitStop = 0; game.deaths += 1;
  game.lives = game.lives > 0 ? game.lives : 3;
  game.message = 'BACK AT ' + game.level.checkpoints[game.checkpoint].name.toUpperCase();
  game.messageTimer = 2.5;
  sound('checkpoint');
  addParticles(game, spawnX, GROUND_Y - 25, '#a0e4cf', 18, 120);
}
export function damagePlayer(game: GameState, sourceX: number, sound: (s: Sfx) => void = () => {}, water = false) {
  const p = game.player;
  if (!water && (p.hurtTimer > 0 || game.power?.kind === 'durian')) return false;
  if (!water && game.power?.kind === 'shield') {
    game.power = null; p.hurtTimer = 1.3; game.message = 'COCONUT SHIELD SAVED YOU!'; game.messageTimer = 1.7;
    sound('shieldBreak'); addParticles(game, p.x, p.y - 40, '#b7efef', 22, 130); return true;
  }
  if (water) game.falls += 1;
  game.lives -= 1;
  sound(water ? 'splash' : 'hurt');
  if (water || game.lives <= 0) { respawn(game, sound); return true; }
  p.hurtTimer = 1.4; p.knockback = .22; game.hitStop = .1;
  p.vx = (p.x < sourceX ? -1 : 1) * 170; p.vy = -260; p.grounded = false;
  game.message = 'SHAKE IT OFF!'; game.messageTimer = 1.2;
  addParticles(game, p.x, p.y - 30, '#ffb293', 12, 100);
  return true;
}
export function addParticles(game: GameState, x: number, y: number, color: string, count: number, energy = 90) {
  for (let i = 0; i < count; i++) {
    const angle = Math.PI * 2 * i / count;
    const speed = energy * (.55 + ((i * 37) % 50) / 100);
    game.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 35, life: .65, maxLife: .65, color, size: 3 + i % 3 });
  }
  if (game.particles.length > 240) game.particles.splice(0, game.particles.length - 240);
}
export function discoverSecret(game: GameState, id: string, sound: (s: Sfx) => void) {
  if (!game.secrets.includes(id)) {
    game.secrets.push(id); game.message = 'A LITTLE SECRET!'; game.messageTimer = 2;
    sound('secret');
  }
  for (const mango of game.mangoes) if (mango.secret === id) mango.hidden = false;
}
export function activatePower(game: GameState, kind: PowerKind, sound: (s: Sfx) => void = () => {}) {
  if (!game.powersUsed.includes(kind)) game.powersUsed.push(kind);
  game.power = { kind, remaining: POWER_META[kind].duration };
  game.superTimer = kind === 'durian' ? POWER_META[kind].duration : 0;
  game.player.airJumps = 0; game.fireCooldown = 0;
  game.message = POWER_META[kind].label; game.messageTimer = 2;
  sound(kind);
  addParticles(game, game.player.x, game.player.y - 40, POWER_META[kind].color, 22, 150);
}
export function rectHit(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
export function landingSurface(previousY: number, nextY: number, centerX: number, game: GameState) {
  const candidates: number[] = [];
  if (groundAt(centerX, game.level) !== null) candidates.push(GROUND_Y);
  for (const platform of game.level.platforms) if (platform.x !== game.level.bridgeStart && centerX > platform.x && centerX < platform.x + platform.width) candidates.push(platform.y);
  for (const board of game.bridgeBoards) if (board.drop < 22 && centerX > board.x && centerX < board.x + board.width) candidates.push(board.y + board.drop);
  for (const item of game.breakables) if (item.active && centerX > item.x - item.width / 2 && centerX < item.x + item.width / 2) candidates.push(item.y - item.height);
  // Vehicle roofs are safe platforms: an early mobile jump can land and continue.
  for (const mover of game.movers) if (mover.active && centerX > mover.x - mover.width / 2 - 8 && centerX < mover.x + mover.width / 2 + 8) candidates.push(mover.y - mover.height);
  for (const gate of game.gates) if (centerX > gate.leverX - 34 && centerX < gate.leverX + 34) candidates.push(gate.switchY);
  return candidates.filter(y => previousY <= y + 8 && nextY >= y).sort((a, b) => a - b)[0] ?? null;
}
export const trafficHitbox = (mover: MovingActor) => ({ x: mover.x - (mover.hitWidth ?? mover.width) / 2, y: mover.y - (mover.hitHeight ?? mover.height), width: mover.hitWidth ?? mover.width, height: mover.hitHeight ?? mover.height });
export function animateParticles(game: GameState, dt: number) {
  for (const particle of game.particles) { particle.life -= dt; particle.x += particle.vx * dt; particle.y += particle.vy * dt; particle.vy += 220 * dt; }
  game.particles = game.particles.filter(p => p.life > 0);
}
export function updateGame(game: GameState, controls: Controls, delta: number, sound: (s: Sfx) => void = () => {}) {
  const dt = clamp(delta, 0, .033);
  game.visualTime += dt;
  animateParticles(game, dt);
  if (game.finishTimer > 0) {
    game.finishTimer += dt; game.player.vx *= Math.max(0, 1 - dt * 7);
    game.player.animation += dt;
    if (Math.floor(game.finishTimer * 12) !== Math.floor((game.finishTimer - dt) * 12))
      addParticles(game, game.player.x + Math.sin(game.finishTimer * 13) * 160, GROUND_Y - 190, ['#ffd267', '#efab9c', '#b9db91'][Math.floor(game.finishTimer * 10) % 3], 5, 70);
    return;
  }
  game.elapsed += dt;
  if (game.hitStop > 0) { game.hitStop = Math.max(0, game.hitStop - dt); return; }
  const p = game.player;
  p.animation += dt; p.hurtTimer = Math.max(0, p.hurtTimer - dt);
  p.landTimer = Math.max(0, p.landTimer - dt); p.doubleTimer = Math.max(0, p.doubleTimer - dt);
  p.knockback = Math.max(0, p.knockback - dt); game.eatTimer = Math.max(0, game.eatTimer - dt);
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  if (game.encouragement) { game.encouragement.remaining -= dt; if (game.encouragement.remaining <= 0) game.encouragement = null; }
  if (game.power) { game.power.remaining -= dt; if (game.power.remaining <= 0) game.power = null; }
  game.superTimer = game.power?.kind === 'durian' ? game.power.remaining : 0;
  const superOn = game.superTimer > 0;
  const flight = game.power?.kind === 'flight';
  const bike = game.power?.kind === 'bike';
  const inMud = p.grounded && game.level.mud.some(m => p.x > m.start && p.x < m.end);
  if (game.level.id === 0 && p.x >= 10400 && p.x < 10750 && !game.scenicSeen) { game.scenicSeen = true; game.scenicTimer = 1.8; }
  game.scenicTimer = Math.max(0, game.scenicTimer - dt);
  let maxSpeed = bike ? 490 : superOn ? SUPER_SPEED : inMud ? 145 : MAX_SPEED;
  if (game.scenicTimer > 0) maxSpeed = Math.min(maxSpeed, 160);
  if (p.x > game.level.finishX - 180) maxSpeed = Math.min(maxSpeed, Math.max(65, (game.level.finishX - p.x) * 2));
  const direction = Number(controls.right) - Number(controls.left);
  if (p.knockback <= 0) {
    if (direction) { p.vx = clamp(p.vx + direction * ACCELERATION * (bike ? 1.6 : superOn ? 1.28 : inMud ? .7 : 1) * dt, -maxSpeed, maxSpeed); p.facing = direction as 1 | -1; }
    else p.vx = Math.sign(p.vx) * Math.max(0, Math.abs(p.vx) - DECELERATION * dt);
  }
  if (p.grounded && Math.abs(p.vx) > 100 && Math.floor(p.animation * 14) !== Math.floor((p.animation - dt) * 14))
    addParticles(game, p.x - p.facing * (bike ? 70 : 42), p.y - 3, superOn ? '#ffe270' : inMud ? '#92725a' : game.level.puddles.some(r => p.x > r.x && p.x < r.x + r.width) ? '#acdbde' : '#c4ab7b', superOn || bike ? 5 : 3, 40);
  game.bikeSoundTimer -= dt;
  if (bike && Math.abs(p.vx) > 150) {
    game.deliveryDistance += Math.abs(p.vx) * dt;
    if (game.bikeSoundTimer <= 0) { sound('engine'); game.bikeSoundTimer = .75; }
    if (game.level.id === 2 && p.x > 6900 && p.x < 7900 && game.deliveryDistance > 900 && !game.secrets.includes('delivery')) discoverSecret(game, 'delivery', sound);
  }

  if (controls.jumpPressed) p.jumpBuffer = JUMP_BUFFER;
  const pressed = controls.jumpPressed;
  controls.jumpPressed = false;
  p.jumpBuffer = Math.max(0, p.jumpBuffer - dt);
  p.coyote = p.grounded ? COYOTE_TIME : Math.max(0, p.coyote - dt);
  if (p.x < game.level.finishX && !flight && p.jumpBuffer > 0 && (p.coyote > 0 || (game.power?.kind === 'double' && pressed && p.airJumps < 1))) {
    const second = p.coyote <= 0;
    p.vy = -(superOn ? 735 : second ? 610 : JUMP_SPEED);
    p.grounded = false; p.coyote = 0; p.jumpBuffer = 0;
    if (second) { p.airJumps += 1; p.doubleTimer = .32; }
    sound(second ? 'double' : 'jump');
    addParticles(game, p.x, p.y, second ? '#fff6c8' : '#c9ae7a', second ? 16 : 8, 90);
  }
  const previousX = p.x, previousY = p.y;
  const wasGrounded = p.grounded;
  if (flight) {
    const desired = controls.jumpHeld ? -235 : 85;
    p.vy += (desired - p.vy) * Math.min(1, dt * 7);
    if (Math.floor(game.visualTime * 10) !== Math.floor((game.visualTime - dt) * 10)) addParticles(game, p.x - p.facing * 30, p.y, '#f6e5ce', 3, 32);
  } else {
    // Keep a generous minimum arc on quick mobile taps, then allow a controlled cut.
    p.vy += GRAVITY * dt;
    if (!controls.jumpHeld && p.vy < -310) p.vy += GRAVITY * .65 * dt;
  }
  p.x = clamp(p.x + p.vx * dt, 40, game.level.worldWidth - 100);
  // Land in front of the welcoming crowd even when arriving with flight.
  if (p.x >= game.level.finishX) { p.x = game.level.finishX; p.vx = 0; game.power = null; game.superTimer = 0; p.jumpBuffer = 0; }
  const nextY = Math.max(150, p.y + p.vy * dt);
  if (nextY === 150) p.vy = Math.max(0, p.vy);
  const fallingSpeed = p.vy;
  const surface = p.vy >= 0 ? landingSurface(previousY, nextY, p.x, game) : null;
  if (surface !== null) {
    p.y = surface; p.vy = 0; p.grounded = true; p.airJumps = 0;
    if (!wasGrounded) { p.landTimer = .16; if (fallingSpeed > 150) addParticles(game, p.x, p.y - 2, '#d4bb85', 9, 75); }
  } else { p.y = nextY; p.grounded = false; }
  const overlaps = (x: number, y: number, w: number, h: number) => rectHit(p.x - PLAYER_WIDTH / 2, p.y - PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT - 3, x, y, w, h);

  for (const gate of game.gates) {
    // Activate only by landing on the highlighted pressure switch, not walking nearby.
    if (!gate.open && !wasGrounded && fallingSpeed > 0 && Math.abs(p.x - gate.leverX) < 34 && Math.abs(p.y - gate.switchY) < 3) {
      gate.open = true; game.message = 'IRRIGATION GATE OPEN!'; game.messageTimer = 1.7; sound('switch');
      addParticles(game, gate.leverX, gate.switchY - 5, '#b8ecce', 16, 100);
    }
    gate.lift += ((gate.open ? 150 : 0) - gate.lift) * Math.min(1, dt * 6);
    if (!gate.open && overlaps(gate.x - 35, GROUND_Y - 136, 70, 136)) { p.x = previousX; p.vx = 0; }
  }
  for (const item of game.breakables) {
    if (!item.active || !overlaps(item.x - item.width / 2, item.y - item.height, item.width, item.height)) continue;
    if (superOn || (bike && item.height <= 50)) {
      item.active = false; sound('smash'); game.message = 'SUPER SMASH!'; game.messageTimer = .9;
      addParticles(game, item.x, item.y - item.height / 2, '#e5ba69', 20, 160);
      if (item.secret) discoverSecret(game, item.secret, sound);
      for (const mango of game.mangoes) if (!mango.secret && mango.hidden && Math.abs(mango.x - item.x) < 600) mango.hidden = false;
    } else if (p.y > item.y - item.height + 12) { p.x = previousX; p.vx = 0; }
  }
  for (const board of game.bridgeBoards) {
    if (board.drop > 0) board.drop += 155 * dt;
    if (p.grounded && p.x > board.x && p.x < board.x + board.width && Math.abs(p.y - board.y - board.drop) < 14) {
      board.timer += dt; if (board.timer > 1.8 && board.drop === 0) board.drop = 1;
    } else if (board.drop === 0) board.timer = Math.max(0, board.timer - dt * .4);
  }
  // Carry the player on harmless mobile platforms; stepping away lets a herd pass.
  for (const mover of game.movers) {
    if (!mover.active) { mover.knocked = Math.max(0, mover.knocked - dt * 1.5); continue; }
    mover.pause = Math.max(0, mover.pause - dt);
    const carried = p.grounded && Math.abs(p.y - (mover.y - mover.height)) < 3 && Math.abs(p.x - mover.x) < mover.width / 2;
    const motion = mover.pause <= 0 ? mover.dir * mover.speed * dt : 0;
    mover.x += motion;
    if (mover.x < mover.minX || mover.x > mover.maxX) { mover.x = clamp(mover.x, mover.minX, mover.maxX); mover.dir = mover.dir === 1 ? -1 : 1; mover.pause = .65; }
    if (carried) p.x += motion;
    const box = trafficHitbox(mover);
    if (!overlaps(box.x, box.y, box.width, box.height)) continue;
    if (mover.kind === 'buffalo') {
      // Harmless herd yields to a waiting visitor; it can always be crossed.
      if (!carried && p.y > mover.y - mover.height + 12 && direction) p.vx *= .6;
    } else if (mover.kind === 'fruitCart') {
      if (!carried && p.y > mover.y - mover.height + 12) { p.x = previousX; p.vx = 0; }
    } else if (superOn) {
      mover.active = false; mover.knocked = 1; sound('smash'); addParticles(game, mover.x, mover.y - 40, '#e7c583', 15, 140);
    } else if (damagePlayer(game, mover.x, sound)) { mover.pause = 1.5; if (game.player !== p) return; }
  }
  for (const pickup of game.powerups) if (!pickup.collected && Math.hypot(p.x - pickup.x, p.y - 40 - pickup.y) < 64) {
    pickup.collected = true; activatePower(game, pickup.kind, sound);
  }
  for (const meal of game.mooPings) if (!meal.collected && Math.hypot(p.x - meal.x, p.y - 35 - meal.y) < 60) {
    meal.collected = true; game.eatTimer = .8;
    if (game.lives < 3) { game.lives += 1; game.message = 'MOO PING! +1 HEART'; }
    else { if (!game.rewardedMeals.includes(meal.x)) game.bonus += 3; game.message = 'MOO PING! LITTLE BONUS'; }
    game.rewardedMeals.push(meal.x); game.messageTimer = 1.7; sound('mooPing');
  }
  for (const mango of game.mangoes) {
    if (mango.hidden && mango.secret && game.secrets.includes(mango.secret)) mango.hidden = false;
    // A high branch can also be found with flight, not only by a smash.
    if (mango.hidden && !mango.secret && Math.abs(p.x - mango.x) < 120 && p.y < 390) mango.hidden = false;
    if (!mango.collected && !mango.hidden && game.power?.kind === 'magnet') {
      const dx = p.x - mango.x, dy = p.y - 35 - mango.y, distance = Math.hypot(dx, dy);
      if (distance > 1 && distance < 235) { const pull = Math.min(distance, dt * 350); mango.x += dx / distance * pull; mango.y += dy / distance * pull; }
    }
    if (mango.collected || mango.hidden || Math.hypot(p.x - mango.x, p.y - 35 - mango.y) >= 48) continue;
    mango.collected = true; game.mangoCount += 1; sound('mango'); addParticles(game, mango.x, mango.y, '#ffd96d', 10, 90);
    if (mango.secret) discoverSecret(game, mango.secret, sound);
  }
  const gold = game.goldenMango;
  if (!gold.collected && Math.hypot(p.x - gold.x, p.y - 40 - gold.y) < 50) {
    gold.collected = true; game.message = 'GOLDEN MANGO FOUND!'; game.messageTimer = 3; sound('golden');
    addParticles(game, gold.x, gold.y, '#fff28a', 36, 180);
  }
  for (const chicken of game.chickens) {
    if (!chicken.active) { chicken.bounce = Math.max(0, chicken.bounce - dt); chicken.x += chicken.dir * 110 * dt; continue; }
    const dangerous = dangerousChicken(chicken);
    const near = Math.abs(p.x - chicken.x) < 220;
    chicken.alert = dangerous && near ? Math.min(1, chicken.alert + dt * 4) : 0;
    let speed = chicken.behavior === 'sleep' ? 0 : chicken.behavior === 'dash' && near ? 105 : dangerous ? 26 : 14;
    if (dangerous && near) chicken.dir = p.x < chicken.x ? -1 : 1;
    if (chicken.behavior === 'dash' && near) chicken.dir = p.x < chicken.x ? 1 : -1;
    const range = chicken.behavior === 'dash' ? 155 : 65;
    if (Math.abs(chicken.x - chicken.originX) > range) { chicken.dir = chicken.x > chicken.originX ? -1 : 1; speed = 26; }
    chicken.x += chicken.dir * speed * dt;
    if (!dangerous || !overlaps(chicken.x - 19, chicken.y - 42, 38, 42)) continue;
    if (superOn || (fallingSpeed > 0 && previousY <= chicken.y - 24)) {
      chicken.active = false; chicken.bounce = 1; p.vy = superOn ? -180 : -340; p.grounded = false;
      sound('stomp'); addParticles(game, chicken.x, chicken.y - 22, '#f7e2bc', 12, 110);
    } else if (damagePlayer(game, chicken.x, sound)) {
      chicken.x += (chicken.x < p.x ? -1 : 1) * 30; chicken.bounce = .6;
      if (game.player !== p) return;
    }
  }
  game.fireCooldown -= dt;
  if (game.power?.kind === 'fire' && game.fireCooldown <= 0) {
    const candidates = [
      ...game.chickens.filter(c => c.active && dangerousChicken(c)).map(c => ({ x: c.x, y: c.y - 27 })),
      ...game.targets.filter(t => t.active),
    ].filter(t => Math.hypot(t.x - p.x, t.y - (p.y - 38)) < 440).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x));
    const target = candidates[0];
    if (target) {
      const dx = target.x - p.x, dy = target.y - (p.y - 38), distance = Math.max(1, Math.hypot(dx, dy));
      game.fireballs.push({ x: p.x + Math.sign(dx) * 48, y: p.y - 38, vx: dx / distance * 470, vy: dy / distance * 470, life: 1.2 });
      game.fireCooldown = .7; sound('fireball');
    }
  }
  for (const fireball of game.fireballs) {
    fireball.x += fireball.vx * dt; fireball.y += fireball.vy * dt; fireball.life -= dt;
    for (const chicken of game.chickens) if (fireball.life > 0 && chicken.active && dangerousChicken(chicken) && Math.hypot(fireball.x - chicken.x, fireball.y - (chicken.y - 25)) < 36) {
      chicken.active = false; chicken.bounce = 1; chicken.dir = fireball.vx > 0 ? 1 : -1; fireball.life = 0;
      addParticles(game, chicken.x, chicken.y - 25, '#ffe4b8', 10, 110); sound('stomp');
    }
    for (const target of game.targets) if (fireball.life > 0 && target.active && Math.hypot(fireball.x - target.x, fireball.y - target.y) < 32) {
      target.active = false; fireball.life = 0; discoverSecret(game, target.secret, sound);
      addParticles(game, target.x, target.y, '#ffd36c', 18, 120);
    }
  }
  game.fireballs = game.fireballs.filter(f => f.life > 0);
  for (const coconut of game.coconuts) {
    if (!coconut.triggered && Math.abs(p.x - coconut.x) < 260) coconut.triggered = true;
    if (!coconut.triggered || coconut.landed) continue;
    coconut.timer += dt;
    if (coconut.timer > 1.35) { coconut.vy += GRAVITY * .5 * dt; coconut.y += coconut.vy * dt; }
    if (coconut.timer > 1.35 && overlaps(coconut.x - 9, coconut.y - 9, 18, 18)) {
      coconut.landed = true; damagePlayer(game, coconut.x, sound); if (game.player !== p) return;
    } else if (coconut.y >= GROUND_Y - 12) { coconut.landed = true; addParticles(game, coconut.x, GROUND_Y - 12, '#977a50', 8, 65); }
  }
  if (p.y > VIEW_HEIGHT + 60) { damagePlayer(game, p.x, sound, true); return; }
  for (let i = game.checkpoint + 1; i < game.level.checkpoints.length; i++) if (p.x >= game.level.checkpoints[i].x && p.y <= GROUND_Y + 5) {
    saveCheckpoint(game, i); game.message = 'CHECKPOINT!'; game.messageTimer = 2.2; sound('checkpoint');
    addParticles(game, game.level.checkpoints[i].x, GROUND_Y - 80, '#f3d17b', 20, 130);
  }
  const phrases = [
    ['เก่งมาก!', 'Gaeng mak!'], ['ไป ไป!', 'Bpai bpai!'], ['สู้ ๆ นะ!', 'Su su na!'],
    ['ยินดีต้อนรับพัทลุง!', 'Yindi dtonrap Phatthalung!'],
  ];
  for (let i = 0; i < 4; i++) if (game.level.id === 0 && p.x >= game.level.finishX * ([.25, .5, .75, .978][i]) && !game.milestones.includes(i)) {
    game.milestones.push(i); game.encouragement = { thai: phrases[i][0], roman: phrases[i][1], remaining: 2.8 }; sound('encouragement');
  }
  if (p.x >= game.level.finishX && p.grounded) { game.finishTimer = .001; game.completionTime = game.elapsed; game.power = null; game.superTimer = 0; p.vx = 0; sound(game.level.id === 2 ? 'victory' : 'levelFinish'); }
  const cameraTarget = clamp(p.x - VIEW_WIDTH * .36, 0, game.level.worldWidth - VIEW_WIDTH);
  game.cameraX += (cameraTarget - game.cameraX) * Math.min(1, dt * 5.5);
}
