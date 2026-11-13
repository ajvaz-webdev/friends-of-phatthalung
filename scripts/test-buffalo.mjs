import assert from 'node:assert/strict';
import { createDriver, routeInput } from '../components/buffalo-boy/qa-driver.ts';
import { createGame, updateGame, activatePower, damagePlayer, saveCheckpoint, respawn, CHECKPOINTS, GROUND_Y, FINISH_X, POWER_META, dangerousChicken, MAX_SPEED, LEVELS } from '../components/buffalo-boy/engine.ts';
import { freshAdventure, resultFor, recordResult, isUnlocked, adventureStamps } from '../components/buffalo-boy/adventure.ts';

const input = () => ({ left: false, right: false, jumpHeld: false, jumpPressed: false });
const tick = (g, c, seconds, dt = 1 / 60) => { for (let t = 0; t < seconds; t += dt) updateGame(g, c, dt); };
let assertions = 0;
function test(name, fn) { fn(); assertions++; console.log('PASS', name); }

test('five checkpoint stops restore every consumed ability and interactive state', () => {
  for (let cp = 1; cp < CHECKPOINTS.length; cp++) {
    const g = createGame(7); g.player.x = CHECKPOINTS[cp].x; saveCheckpoint(g, cp);
    const snapshot = structuredClone(g.snapshot);
    for (const p of g.powerups) p.collected = true;
    g.gates.forEach(gate => { gate.open = true; gate.lift = 150; });
    g.breakables.forEach(b => { b.active = false; }); g.bridgeBoards.forEach(b => { b.drop = 100; });
    g.targets.forEach(t => { t.active = false; }); g.mangoes[0].collected = true; g.mangoCount = 1;
    g.goldenMango.collected = true; g.secrets = ['flight'];
    damagePlayer(g, 0, () => {}, true);
    assert.equal(g.player.x, CHECKPOINTS[cp].x); assert.equal(g.power, null);
    assert.deepEqual(g.powerups, snapshot.powerups); assert.deepEqual(g.gates, snapshot.gates);
    assert.deepEqual(g.breakables, snapshot.breakables); assert.deepEqual(g.bridgeBoards, snapshot.bridgeBoards);
    assert.deepEqual(g.targets, snapshot.targets); assert.equal(g.mangoCount, 1); assert(g.goldenMango.collected);
    assert(g.powerups.filter(p => p.x >= CHECKPOINTS[cp].x).every(p => !p.collected));
  }
});
test('each ability is restored after collection and checkpoint death', () => {
  for (const kind of Object.keys(POWER_META)) {
    const levelIndex = LEVELS.findIndex(l => l.powerSeeds.some(p => p[0] === kind));
    const g = createGame(1, levelIndex), item = g.powerups.find(p => p.kind === kind);
    g.player.x = item.x; g.player.y = item.y + 40; updateGame(g, input(), 1 / 60);
    assert(item.collected); assert.equal(g.power?.kind, kind);
    damagePlayer(g, 0, () => {}, true);
    assert.equal(g.powerups.find(p => p.id === item.id).collected, false);
  }
});
test('one major power replaces another; expiry clears the mode', () => {
  const g = createGame(1); activatePower(g, 'durian'); activatePower(g, 'flight');
  assert.equal(g.superTimer, 0); assert.equal(g.power.kind, 'flight');
  tick(g, input(), 9.2); assert.equal(g.power, null);
});
test('damage has hit-stop, knockback and invulnerability; three hits respawn', () => {
  const g = createGame(1); g.player.x = 600;
  damagePlayer(g, 640); assert.equal(g.lives, 2); assert.equal(g.player.x, 600); assert.equal(g.hitStop, .1); assert(g.player.vx < 0);
  damagePlayer(g, 640); assert.equal(g.lives, 2);
  g.player.hurtTimer = 0; damagePlayer(g, 640); g.player.hurtTimer = 0; damagePlayer(g, 640);
  assert.equal(g.lives, 3); assert.equal(g.player.x, 220); assert.equal(g.deaths, 1);
});
test('durian speed, higher jump, smash and invincibility; water never soft-locks', () => {
  const g = createGame(1); g.player.x = 5850; activatePower(g, 'durian');
  tick(g, { ...input(), right: true }, .9);
  assert(g.player.vx > MAX_SPEED); assert.equal(g.breakables.find(b => b.x === 5980).active, false);
  damagePlayer(g, g.player.x + 20); assert.equal(g.lives, 3);
  updateGame(g, { ...input(), jumpHeld: true, jumpPressed: true }, 1 / 60); assert(g.player.vy < -680);
  damagePlayer(g, 0, () => {}, true); assert.equal(g.deaths, 1); assert.equal(g.power, null);
});
test('Cha Yen hold rises, release descends slowly, left/right still steer', () => {
  const g = createGame(1); activatePower(g, 'flight');
  tick(g, { ...input(), right: true, jumpHeld: true }, 1);
  const high = g.player.y; assert(high < GROUND_Y - 150); assert(g.player.x > 350);
  tick(g, input(), 1); assert(g.player.y > high); assert(g.player.vy <= 86);
});
test('sticky rice gives one responsive second jump, never a third', () => {
  const g = createGame(1); activatePower(g, 'double');
  updateGame(g, { ...input(), jumpPressed: true, jumpHeld: true }, 1 / 60);
  tick(g, { ...input(), jumpHeld: true }, .24);
  updateGame(g, { ...input(), jumpPressed: true, jumpHeld: true }, 1 / 60);
  assert.equal(g.player.airJumps, 1); assert(g.player.vy < -550);
  tick(g, { ...input(), jumpHeld: true }, .2); const before = g.player.vy;
  updateGame(g, { ...input(), jumpPressed: true, jumpHeld: true }, 1 / 60);
  assert(g.player.vy > before); assert.equal(g.player.airJumps, 1);
});
test('Mala automatically hits optional target and reveals reward without fire input', () => {
  const g = createGame(1); g.player.x = 12780; activatePower(g, 'fire'); tick(g, input(), 1.7);
  assert.equal(g.targets[0].active, false); assert(g.secrets.includes('fire'));
  assert(g.mangoes.filter(m => m.secret === 'fire').every(m => !m.hidden));
});
test('Mala shoos enemy chickens, passive chickens never inflict damage', () => {
  const g = createGame(1); const danger = g.chickens.find(c => c.behavior === 'guard');
  g.powerups.forEach(p => { p.collected = true; });
  g.player.x = danger.x - 220; activatePower(g, 'fire'); tick(g, input(), 1.2); assert.equal(danger.active, false);
  const passive = g.chickens.find(c => c.behavior === 'sleep'); g.player.x = passive.x;
  g.power = null; tick(g, input(), .1); assert.equal(g.lives, 3);
});
test('Moo Ping heals and full-health bonus cannot inflate mango completion count', () => {
  const g = createGame(1); g.player.x = g.mooPings[0].x; g.lives = 2; tick(g, input(), .05); assert.equal(g.lives, 3);
  g.player.x = g.mooPings[1].x; tick(g, input(), .05); assert.equal(g.mangoCount, 0); assert.equal(g.bonus, 3);
});
test('switch requires an actual jump landing, then opens reliably', () => {
  const g = createGame(1), gate = g.gates[0]; g.player.x = gate.leverX;
  tick(g, input(), .1); assert.equal(gate.open, false);
  const c = { ...input(), jumpPressed: true, jumpHeld: true }; tick(g, c, 1.2); assert.equal(gate.open, true);
});
test('Golden Mango is separate from ordinary fruit and survives death', () => {
  const g = createGame(1); g.player.x = g.goldenMango.x; g.player.y = g.goldenMango.y + 40;
  const count = g.mangoCount; updateGame(g, input(), .016); assert(g.goldenMango.collected); assert.equal(g.mangoCount, count);
  respawn(g); assert(g.goldenMango.collected);
});
test('bridge gives at least 1.8 seconds warning before dropping', () => {
  const g = createGame(1), board = g.bridgeBoards[0]; g.powerups.forEach(p => p.collected = true);
  g.player.x = board.x + 25; g.player.y = board.y;
  tick(g, input(), 1.65); assert.equal(board.drop, 0); tick(g, input(), .3); assert(board.drop > 0);
});
test('normal blue-truck jumps: repeat both directions, mobile tap/hold and 30/60fps', () => {
  const failures = [];
  for (const dir of [-1, 1]) for (const gap of [125, 150, 175, 200]) for (const hold of [.12, .35, .65]) for (const dt of [1 / 60, 1 / 30]) {
    const g = createGame(1); g.powerups.forEach(p => p.collected = true);
    const car = g.movers.find(m => m.kind === 'pickup'); car.dir = dir;
    g.player.x = car.x - 320; g.player.vx = MAX_SPEED; let jumped = false, jumpAt = 0;
    for (let t = 0; t < 3.8; t += dt) {
      const c = { ...input(), right: true };
      if (!jumped && car.x - g.player.x < gap) { jumped = true; jumpAt = t; c.jumpPressed = true; }
      c.jumpHeld = jumped && t - jumpAt < hold;
      updateGame(g, c, dt);
    }
    if (g.lives < 3 || g.player.x < car.x + 70) failures.push({ dir, gap, hold, dt, lives: g.lives, x: g.player.x, car: car.x });
  }
  assert.deepEqual(failures, []);
});
test('gameplay placements stay deterministic while scenery varies', () => {
  const a = createGame(1), b = createGame(2);
  assert.deepEqual(a.powerups, b.powerups); assert.deepEqual(a.movers, b.movers);
  assert.deepEqual(a.chickens.filter(dangerousChicken), b.chickens.filter(dangerousChicken));
  assert.notEqual(a.chickens[0].x, b.chickens[0].x);
});
test('finish waits for grounded approach and a 3.2s celebration; restart is clean', () => {
  const g = createGame(1); g.player.x = FINISH_X; g.player.y = 300; g.player.grounded = false;
  tick(g, input(), .1); assert.equal(g.finishTimer, 0);
  g.player.y = GROUND_Y; g.player.grounded = true; tick(g, input(), .04); assert(g.finishTimer > 0 && g.finishTimer < 3.2);
  const time = g.completionTime; tick(g, input(), 3.3); assert(g.finishTimer >= 3.2); assert.equal(g.completionTime, time);
  assert.equal(createGame(1).goldenMango.collected, false); assert.equal(createGame(1).finishTimer, 0);
});
test('complete the unmodified level using only left/right/jump at 30 and 60 fps', () => {
  for (const dt of [1 / 60, 1 / 30]) for (const seed of [1, 77, 153]) {
    const g = createGame(seed), driver = createDriver();
    for (let t = 0; t < 230 && g.finishTimer < 3.2; t += dt) updateGame(g, routeInput(g, driver, dt), dt);
    assert(g.finishTimer >= 3.2, JSON.stringify({ seed, dt, x: g.player.x, y: g.player.y, deaths: g.deaths, gates: g.gates }));
    assert.equal(g.checkpoint, 5); assert.equal(g.milestones.length, 4);
    console.log('ROUTE', JSON.stringify({ seed, fps: Math.round(1 / dt), seconds: Math.round(g.completionTime), deaths: g.deaths, mangoes: g.mangoCount }));
  }
});
test('all three routes are finishable repeatedly with real controls, including low-frame-rate phones', () => {
  for (const level of LEVELS) for (const dt of [1 / 60, 1 / 30]) for (const seed of [18, 93, 541]) {
    const g = createGame(seed, level.id), driver = createDriver();
    for (let t = 0; t < 230 && g.finishTimer < 3.2; t += dt) updateGame(g, routeInput(g, driver, dt), dt);
    assert(g.finishTimer >= 3.2, JSON.stringify({ level: level.name, seed, dt, x: g.player.x, y: g.player.y, deaths: g.deaths, gates: g.gates }));
    assert.equal(g.checkpoint, level.checkpoints.length - 1);
    assert(g.deaths <= 1, 'Casual route should be forgiving');
    console.log('ADVENTURE ROUTE', JSON.stringify({ level: level.id, seed, fps: Math.round(1 / dt), seconds: Math.round(g.completionTime), deaths: g.deaths, mangoes: g.mangoCount, powers: g.powersUsed }));
  }
});
test('every checkpoint in every route restores all pickups and mechanisms', () => {
  for (const level of LEVELS) for (let cp = 0; cp < level.checkpoints.length; cp++) {
    const g = createGame(44, level.id); g.player.x = level.checkpoints[cp].x; saveCheckpoint(g, cp);
    const snapshot = structuredClone(g.snapshot);
    g.powerups.forEach(p => { p.collected = true; }); g.breakables.forEach(b => { b.active = false; });
    g.gates.forEach(b => { b.open = true; }); g.bridgeBoards.forEach(b => { b.drop = 80; });
    activatePower(g, 'bike'); damagePlayer(g, 0, () => {}, true);
    assert.equal(g.power, null); assert.equal(g.player.x, level.checkpoints[cp].x);
    for (const field of Object.keys(snapshot)) assert.deepEqual(g[field], snapshot[field]);
    assert.equal(g.falls, 1);
  }
});
test('delivery bike is fast, steers, hops, smashes small crates, reveals bonus, and expires', () => {
  const g = createGame(9, 2); g.player.x = 4530; updateGame(g, input(), 1 / 60);
  assert.equal(g.power.kind, 'bike');
  tick(g, { ...input(), right: true }, 6);
  assert(g.player.x > 7000); assert(g.player.vx > 470); assert(g.secrets.includes('delivery'));
  assert(g.breakables.filter(b => b.height <= 50).every(b => !b.active));
  updateGame(g, { ...input(), jumpPressed: true, jumpHeld: true }, 1 / 60); assert(g.player.vy < -550);
  tick(g, { ...input(), left: true }, .7); assert(g.player.vx < 0);
  tick(g, input(), 10.1); assert.equal(g.power, null);
});
test('coconut shield absorbs exactly one hazard hit with distinct sound', () => {
  const g = createGame(9, 1), sounds = []; activatePower(g, 'shield');
  damagePlayer(g, 300, s => sounds.push(s)); assert.equal(g.lives, 3); assert.equal(g.power, null); assert(sounds.includes('shieldBreak'));
  damagePlayer(g, 300); assert.equal(g.lives, 3);
  g.player.hurtTimer = 0; damagePlayer(g, 300); assert.equal(g.lives, 2);
});
test('khanom attracts nearby visible mangoes but never hidden or golden ones', () => {
  const g = createGame(9); g.player.x = 600; g.mangoes = [{x:760,y:480,collected:false}, {x:710,y:480,collected:false,hidden:true,secret:'fire'}];
  g.goldenMango.x = 800; g.goldenMango.y = 450; activatePower(g, 'magnet'); tick(g, input(), 1.2);
  assert.equal(g.mangoCount, 1); assert.equal(g.mangoes[1].collected, false); assert.equal(g.goldenMango.x, 800); assert.equal(g.goldenMango.collected, false);
});
test('map locks, full completion and personal-best stamps do not double-count replays', () => {
  let journey = freshAdventure(); assert(isUnlocked(journey, 0)); assert(!isUnlocked(journey, 1));
  for (const level of LEVELS) {
    const g = createGame(9, level.id); g.mangoCount = 5; g.completionTime = 50; g.powersUsed = ['durian'];
    if (level.id === 0) g.goldenMango.collected = true;
    if (level.id === 2) { g.deliveryDistance = 2000; g.secrets = ['delivery']; }
    journey = recordResult(journey, resultFor(g)); journey = recordResult(journey, resultFor(g));
    if (level.id < 2) assert(isUnlocked(journey, level.id + 1));
  }
  assert(journey.every(Boolean)); assert.equal(journey.reduce((n, r) => n + r.mangoes, 0), 15);
  assert(adventureStamps(journey).includes('Golden Mango')); assert(adventureStamps(journey).includes('Speed Delivery'));
});
test('flight and held-jump arrivals land at the crowd, never beyond it', () => {
  for (const level of LEVELS) {
    const g = createGame(9, level.id);
    g.player.x = level.finishX - 50; g.player.y = 210; g.player.grounded = false;
    activatePower(g, 'flight');
    tick(g, { ...input(), right: true, jumpHeld: true, jumpPressed: true }, 6);
    assert.equal(g.player.x, level.finishX); assert.equal(g.player.y, GROUND_Y);
    assert(g.finishTimer >= 3.2); assert.equal(g.power, null);
  }
});
console.log(`Completed ${assertions} regression groups.`);
