import type { LevelDefinition, Scenery } from './engine';

const ground = 584;
const fruit = (start: number, count: number, spacing: number, y = 523) => Array.from({ length: count }, (_, i) => [start + i * spacing, y - i % 3 * 10] as [number, number]);
const scenery = (kinds: Scenery['kind'][], count: number, spacing: number): Scenery[] => Array.from({ length: count }, (_, i) => ({ x: 550 + i * spacing, kind: kinds[i % kinds.length], variant: i % 3 }));

// Required geometry/pickups are fixed. Only background dressing varies by seed.
export const EXTRA_LEVELS: LevelDefinition[] = [
  {
    id: 1, name: 'Thale Noi Trails', subtitle: 'Lotus water, little rain, and a slower kind of road.', worldWidth: 12600, finishX: 12030,
    checkpoints: [{ x: 220, name: 'Lakeside' }, { x: 2700, name: 'Lotus Landing' }, { x: 5550, name: 'Fishing Village' }, { x: 8550, name: 'Reed Beds' }, { x: 10900, name: 'Homeward Walkway' }],
    canals: [{ start: 1800, end: 2400 }, { start: 4120, end: 4860 }, { start: 7240, end: 7780 }, { start: 9540, end: 9960 }],
    platforms: [{ x: 1720, y: 574, width: 820, kind: 'wood' }, { x: 4000, y: 574, width: 960, kind: 'wood' }, { x: 7130, y: 556, width: 820, kind: 'wood' }, { x: 9440, y: 574, width: 650, kind: 'wood' }, { x: 3400, y: 370, width: 330, kind: 'wood' }, { x: 6160, y: 430, width: 350, kind: 'wood' }],
    mangoSeeds: [...fruit(570, 9, 310), ...fruit(4160, 6, 280, 516), ...fruit(6470, 9, 300, 512), ...fruit(9490, 8, 310, 517)],
    secretMangoes: [0, 1, 2].map(i => ({ x: 3430 + i * 110, y: 300, collected: false, secret: 'flight' })).concat([0, 1].map(i => ({ x: 6200 + i * 110, y: 350, collected: false, secret: 'double' }))),
    powerSeeds: [['shield', 980, 530], ['flight', 2920, 530], ['durian', 5620, 530], ['double', 6010, 530], ['magnet', 8080, 530], ['fire', 8690, 530], ['flight', 11000, 530]],
    meals: [[2620, 520], [6840, 520], [10670, 520]], chickenSeeds: [1320, 3580, 5400, 6910, 9130, 10380],
    breakables: [{ x: 5770, y: ground, width: 90, height: 58, kind: 'hay' }],
    gates: [{ x: 5220, leverX: 5080, switchY: 564 }],
    movers: [{ x: 6770, y: ground, minX: 6650, maxX: 7050, width: 134, height: 52, speed: 29, dir: 1, kind: 'fruitCart' }, { x: 10200, y: ground, minX: 10120, maxX: 10400, width: 126, height: 60, speed: 20, dir: -1, kind: 'buffalo' }],
    coconuts: [640, 8330], bridgeStart: 4000, bridgeY: 574, bridgeCount: 15,
    targets: [{ x: 9050, y: 488, active: true, secret: 'fire' }],
    mud: [{ start: 8210, end: 8410 }], puddles: [{ x: 5680, width: 150 }, { x: 8370, width: 110 }],
    scenery: [...scenery(['lotus', 'shelter', 'buffalo', 'palm', 'farmer', 'house', 'lotus'], 20, 560), { x: 11980, kind: 'shelter' }],
    sections: [{ until: 2700, name: 'Lotus Water' }, { until: 5550, name: 'Wooden Walkways' }, { until: 8550, name: 'Fishing Village' }, { until: 10900, name: 'Reeds & Light Rain' }, { until: 12600, name: 'Lakeside Welcome' }],
  },
  {
    id: 2, name: 'Town & Market Dash', subtitle: 'Market colors, roadside treats, and one speedy delivery.', worldWidth: 14500, finishX: 13930,
    checkpoints: [{ x: 220, name: 'Market Road' }, { x: 3100, name: 'Food Stalls' }, { x: 4370, name: 'Delivery Stop' }, { x: 8400, name: 'Old Town' }, { x: 11100, name: 'Friends Ahead' }, { x: 13200, name: 'Warm Welcome' }],
    canals: [], platforms: [{ x: 1040, y: 520, width: 210, kind: 'earth' }, { x: 9530, y: 426, width: 310, kind: 'wood' }, { x: 11900, y: 360, width: 340, kind: 'wood' }],
    mangoSeeds: [...fruit(570, 10, 360), ...fruit(4750, 19, 180), ...fruit(8800, 5, 380), ...fruit(11100, 9, 290)],
    secretMangoes: [...[0, 1, 2].map(i => ({ x: 7200 + i * 110, y: 470, collected: false, hidden: true, secret: 'delivery' })), ...[0, 1].map(i => ({ x: 9580 + i * 110, y: 352, collected: false, secret: 'double' })), ...[0, 1].map(i => ({ x: 11950 + i * 110, y: 280, collected: false, secret: 'flight' })), { x: 10860, y: 510, collected: false, hidden: true, secret: 'fire' }],
    powerSeeds: [['magnet', 730, 530], ['durian', 1630, 530], ['shield', 3230, 530], ['bike', 4530, 530], ['bike', 7650, 530], ['double', 9190, 530], ['fire', 10380, 530], ['flight', 11550, 530], ['durian', 12940, 530]],
    meals: [[2870, 515], [8560, 515], [12620, 515]], chickenSeeds: [1410, 3950, 8710, 9910, 11280, 13050],
    breakables: [{ x: 1790, y: ground, width: 82, height: 62, kind: 'crate' }, ...[5140, 5810, 6440].map(x => ({ x, y: ground, width: 65, height: 38, kind: 'crate' as const }))],
    gates: [], movers: [{ x: 2470, y: ground, minX: 2280, maxX: 2680, width: 142, height: 64, hitWidth: 84, hitHeight: 42, speed: 32, dir: -1, kind: 'pickup' }, { x: 3810, y: ground, minX: 3630, maxX: 4040, width: 120, height: 65, speed: 35, dir: 1, kind: 'fruitCart' }, { x: 8970, y: ground, minX: 8780, maxX: 9090, width: 92, height: 54, hitWidth: 48, hitHeight: 34, speed: 36, dir: -1, kind: 'motorbike' }, { x: 12450, y: ground, minX: 12340, maxX: 12580, width: 142, height: 64, hitWidth: 84, hitHeight: 42, speed: 30, dir: 1, kind: 'pickup' }],
    coconuts: [1120], bridgeStart: 0, bridgeY: 574, bridgeCount: 0,
    targets: [{ x: 10780, y: 486, active: true, secret: 'fire' }], mud: [], puddles: [{ x: 5350, width: 85 }, { x: 6880, width: 90 }],
    scenery: [...scenery(['house', 'fruitStand', 'mooPingStand', 'motorbike', 'people', 'pickup', 'mangoTree'], 25, 510), { x: 13900, kind: 'building' }],
    sections: [{ until: 3100, name: 'Morning Market' }, { until: 4370, name: 'Food Stalls' }, { until: 8400, name: 'Special Delivery!' }, { until: 11100, name: 'Old Town' }, { until: 13200, name: 'Friends Ahead' }, { until: 14500, name: 'A Warm Welcome' }],
  },
];
