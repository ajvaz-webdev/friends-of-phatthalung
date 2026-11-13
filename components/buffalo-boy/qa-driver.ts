// Local QA only. Drives the same left/right/jump inputs; never changes game state.
import type { Controls, GameState } from './engine';

export type RouteDriver = { jumpUntil: number; jumpAt: number; lastX: number; stuck: number };
export const createDriver = (): RouteDriver => ({ jumpUntil: 0, jumpAt: -10, lastX: 220, stuck: 0 });
export function routeInput(game: GameState, driver: RouteDriver, dt: number): Controls {
  const p = game.player, now = game.elapsed;
  const c: Controls = { left: false, right: true, jumpHeld: now < driver.jumpUntil, jumpPressed: false };
  driver.stuck = Math.abs(p.x - driver.lastX) < .1 ? driver.stuck + dt : 0;
  driver.lastX = p.x;
  const jump = () => { if (p.grounded && now - driver.jumpAt > .25) { c.jumpPressed = true; c.jumpHeld = true; driver.jumpAt = now; driver.jumpUntil = now + .65; } };
  const gate = game.gates.find(g => !g.open && p.x > g.leverX - 135 && p.x < g.x + 70);
  if (gate) {
    if (p.x > gate.leverX + 12) { c.right = false; c.left = true; }
    else if (p.x > gate.leverX - 35) { c.right = false; if (Math.abs(p.vx) < 20) jump(); }
    return c;
  }
  if (game.power?.kind === 'flight') {
    c.jumpHeld = p.y > (p.x > 9800 && p.x < 10450 ? 302 : 305);
    return c;
  }
  const obstacle = game.breakables.some(b => b.active && b.x - p.x > 0 && b.x - p.x < 155 && p.y > b.y - b.height + 8);
  const traffic = game.movers.some(m => m.active && m.kind !== 'buffalo' && m.x - p.x > 0 && m.x - p.x < 140);
  const enemy = game.chickens.some(ch => ch.active && (ch.behavior === 'pace' || ch.behavior === 'guard') && ch.x - p.x > 0 && ch.x - p.x < 130);
  const bridge = game.level.platforms.some(({ x, y, kind }) => kind === 'wood' && y > 500 && p.x > x - 85 && p.x < x + 10 && p.y > y - 10);
  if (obstacle || traffic || enemy || bridge || driver.stuck > .3) jump();
  return c;
}
