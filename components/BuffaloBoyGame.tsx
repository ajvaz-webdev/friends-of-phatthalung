'use client';

import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import styles from './BuffaloBoyGame.module.css';

import {
  VIEW_WIDTH, VIEW_HEIGHT, GROUND_Y,
  POWER_META, LEVELS,
  clamp, isCanal, sectionAt, createGame, updateGame, animateParticles, dangerousChicken, cosmetic,
} from './buffalo-boy/engine';
import type {
  GameMode, Sfx, GameState, Mango, SpecialPickup, Breakable, Gate,
  MovingActor, Coconut, Chicken, PowerPickup, PowerKind,
} from './buffalo-boy/engine';
import type { RouteDriver } from './buffalo-boy/qa-driver';
import { freshAdventure, resultFor, recordResult, isUnlocked, adventureStamps, STAMPS } from './buffalo-boy/adventure';
import type { LevelResult } from './buffalo-boy/adventure';
import { loadArt, sprite, person, panorama, irrigationGate, POWER_ART } from './buffalo-boy/art';
let buffaloAtlas: HTMLImageElement | null = null;
let buffaloOutline: HTMLCanvasElement | null = null;

function pixelText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, color: string, align: CanvasTextAlign = 'left') {
  ctx.save();
  ctx.font = `700 ${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#102d26';
  ctx.fillText(text, x + 2, y + 2);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}



function drawSky(ctx: CanvasRenderingContext2D, game: GameState) {
  const sunset = clamp((game.player.x - 15800) / 5000, 0, 1);
  const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  gradient.addColorStop(0, '#79b7c5');
  gradient.addColorStop(0.62, '#d8ddb7');
  gradient.addColorStop(1, '#f1cb83');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  if (sunset > 0) {
    ctx.fillStyle = `rgba(211, 102, 65, ${sunset * 0.42})`;
    ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  }
  ctx.fillStyle = sunset > 0.55 ? '#f1a35f' : '#f4cf7a';
  ctx.fillRect(760, 84, 78, 78);
}

function drawParallax(ctx: CanvasRenderingContext2D, game: GameState) {
  panorama(ctx, game.level.id, game.cameraX);
}

function drawMountain(ctx: CanvasRenderingContext2D, game: GameState) {
  if (game.level.id !== 0) return;
  const distance = 10800 - game.player.x;
  const closeness = 1 - clamp(Math.abs(distance) / 11000, 0, 1);
  const scale = .24 + Math.pow(closeness, 2) * .7;
  const x = VIEW_WIDTH / 2 + clamp(distance * .035, -370, 320);
  sprite(ctx, 'mountain', x, 486, 756 * scale, 470 * scale);
  if (Math.abs(distance) < 1200) {
    sprite(ctx, 'sevenEleven', 10780 - game.cameraX, GROUND_Y - 30, 190, 150);
    if (Math.abs(distance) < 850 && !game.encouragement) pixelText(ctx, 'KHAO OK THALU · HALFWAY', 480, 112, 24, '#fff0bf', 'center');
  }
}

function drawPalm(ctx: CanvasRenderingContext2D, x: number, y: number, variant = 0) {
  sprite(ctx, 'palm', x, y, 155 + variant * 6, 205 + variant * 8);
}

function drawHouse(ctx: CanvasRenderingContext2D, x: number, y: number, variant = 0) {
  sprite(ctx, 'house', x, y, 195 + variant * 8, 152);
}

function drawBuffalo(ctx: CanvasRenderingContext2D, x: number, y: number, variant = 0, look = false) {
  if (!buffaloAtlas?.complete || !buffaloAtlas.naturalWidth) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(variant % 2 ? -.85 : .85, .85);
  ctx.drawImage(buffaloAtlas, look ? 192 : 0, 0, 192, 192, -96, -176, 192, 192); ctx.restore();
}

function drawFruitStand(ctx: CanvasRenderingContext2D, x: number, y: number, variant = 0) {
  sprite(ctx, 'fruitStall', x, y, 148 + variant * 8, 115);
}

function drawVehicle(ctx: CanvasRenderingContext2D, x: number, y: number, kind: 'motorbike' | 'pickup' | 'tuktuk', variant = 0) {
  sprite(ctx, kind === 'pickup' ? 'pickup' : 'motorbike', x, y, kind === 'pickup' ? 150 : 112, kind === 'pickup' ? 79 : 72, variant % 2 === 0);
}

function drawMangoTree(ctx: CanvasRenderingContext2D, x: number, y: number, variant = 0) {
  sprite(ctx, 'palm', x, y, 170 + variant * 5, 195);
}

function drawShelter(ctx: CanvasRenderingContext2D, x: number, y: number) {
  sprite(ctx, 'house', x, y, 165, 128);
}

function drawLotus(ctx: CanvasRenderingContext2D, x: number, y: number, variant = 0) {
  ctx.strokeStyle = '#446c48';
  ctx.lineWidth = 4;
  for (let index = 0; index < 5; index += 1) {
    const offset = index * 24 - 48;
    ctx.beginPath();
    ctx.moveTo(x + offset, y);
    ctx.lineTo(x + offset + (index % 2 ? 5 : -5), y - 44 - (index % 3) * 9);
    ctx.stroke();
    ctx.fillStyle = index % 2 ? '#db7f9c' : '#f0a4b6';
    ctx.fillRect(x + offset - 8, y - 55 - (index % 3) * 9, 17, 9);
    ctx.fillStyle = '#688d4e';
    ctx.fillRect(x + offset - 14, y - 12, 29, 7);
  }
  if (variant === 1) {
    ctx.fillStyle = '#f5d7da';
    ctx.fillRect(x + 16, y - 78, 11, 7);
  }
}

function drawPeople(ctx: CanvasRenderingContext2D, x: number, y: number, variant = 0, time = 0) {
  person(ctx, variant % 6, x - 24, y, 58, 116, 'wave', time); person(ctx, (variant + 2) % 6, x + 30, y, 58, 116, 'idle', time);
}

function drawFarmer(ctx: CanvasRenderingContext2D, x: number, y: number, turn: boolean) {
  sprite(ctx, 'person5', x, y, 56, 112, turn);
}

function drawDog(ctx: CanvasRenderingContext2D, x: number, y: number, watch: boolean) {
  sprite(ctx, 'dog', x, y, 72, 65, !watch);
}

function drawBuilding(ctx: CanvasRenderingContext2D, x: number, y: number) {
  sprite(ctx, 'hall', x, y, 290, 225);
}

function drawScenery(ctx: CanvasRenderingContext2D, game: GameState) {
  const left = game.cameraX - 180;
  const right = game.cameraX + VIEW_WIDTH + 180;
  for (const item of game.level.scenery) {
    if (item.x < left || item.x > right) continue;
    const x = Math.round(item.x - game.cameraX);
    const backgroundTraffic = item.kind === 'pickup' || item.kind === 'motorbike' || item.kind === 'tuktuk';
    const y = GROUND_Y - (backgroundTraffic ? 50 : 0);
    ctx.save();
    if (backgroundTraffic) ctx.globalAlpha = .63;
    switch (item.kind) {
      case 'buffalo': drawBuffalo(ctx, x, y, item.variant, Math.abs(game.player.x - item.x) < 220); break;
      case 'house': drawHouse(ctx, x, y, item.variant); break;
      case 'palm': drawPalm(ctx, x, y, item.variant); break;
      case 'mangoTree': drawMangoTree(ctx, x, y, item.variant); break;
      case 'fruitStand': drawFruitStand(ctx, x, y, item.variant); break;
      case 'motorbike': drawVehicle(ctx, x, y, 'motorbike', item.variant); break;
      case 'pickup': drawVehicle(ctx, x, y, 'pickup', Math.floor(cosmetic(game.cosmeticSeed, item.x) * 2)); break;
      case 'tuktuk': drawVehicle(ctx, x, y, 'tuktuk', item.variant); break;
      case 'hay':
        sprite(ctx, 'hay', x, y, 86, 60);
        break;
      case 'sign':
        ctx.save();
        ctx.translate(x, y - 64);
        ctx.rotate(Math.sin(game.elapsed * 2.2 + item.x) * (Math.abs(game.player.x - item.x) < 230 ? .05 : .015));
        ctx.fillStyle = '#6c4b34';
        ctx.fillRect(-4, -14, 8, 78);
        ctx.fillStyle = '#e2c884';
        ctx.fillRect(-58, -29, 116, 31);
        pixelText(ctx, item.variant ? 'MANGOES →' : 'SLOW · CHICKENS', 0, -14, 11, '#254739', 'center');
        ctx.restore();
        break;
      case 'shelter': drawShelter(ctx, x, y); break;
      case 'lotus':
        ctx.save();
        ctx.translate(0, Math.abs(game.player.x - item.x) < 190 ? Math.sin(game.elapsed * 9) * 3 : 0);
        drawLotus(ctx, x, y, item.variant);
        ctx.restore();
        break;
      case 'people': drawPeople(ctx, x, y, item.variant, game.visualTime); break;
      case 'mooPingStand': drawMooPingStand(ctx, x, y, Math.abs(game.player.x - item.x) < 260, item.variant); break;
      case 'farmer': drawFarmer(ctx, x, y, Math.abs(game.player.x - item.x) < 220); break;
      case 'dog': drawDog(ctx, x, y, Math.abs(game.player.x - item.x) < 240); break;
      case 'building': if (Math.abs(item.x - game.level.finishX) > 400) drawBuilding(ctx, x, y); break;
    }
    ctx.restore();
  }

  if (game.level.id === 0 && game.player.x > 16400 && game.player.x < 19400) {
    const movingX = 16600 + ((game.elapsed * 48) % 2500);
    ctx.save(); ctx.globalAlpha = .55;
    drawVehicle(ctx, Math.round(movingX - game.cameraX), GROUND_Y - 55, 'pickup', 1);
    ctx.restore();
  }
}

function drawTerrain(ctx: CanvasRenderingContext2D, game: GameState) {
  ctx.fillStyle = '#6f5737';
  const start = Math.floor(game.cameraX / 32) * 32;
  for (let worldX = start; worldX < game.cameraX + VIEW_WIDTH + 64; worldX += 32) {
    if (isCanal(worldX + 16, game.level)) continue;
    const x = Math.round(worldX - game.cameraX);
    ctx.fillRect(x, GROUND_Y, 34, VIEW_HEIGHT - GROUND_Y);
    ctx.fillStyle = '#75964c';
    ctx.fillRect(x, GROUND_Y, 34, 11);
    ctx.fillStyle = '#6f5737';
  }

  for (const canal of game.level.canals) {
    const x = Math.round(canal.start - game.cameraX);
    const width = canal.end - canal.start;
    if (x > VIEW_WIDTH || x + width < 0) continue;
    ctx.fillStyle = '#4f8e93';
    ctx.fillRect(x, GROUND_Y - 2, width, VIEW_HEIGHT - GROUND_Y + 2);
    ctx.fillStyle = '#83bdac';
    for (let stripe = 0; stripe < width; stripe += 54) ctx.fillRect(x + stripe, GROUND_Y + 15 + (stripe % 3) * 9, 28, 5);
  }

  for (const platform of game.level.platforms) {
    if (platform.x === game.level.bridgeStart) continue;
    const x = Math.round(platform.x - game.cameraX);
    if (x > VIEW_WIDTH || x + platform.width < 0) continue;
    if (platform.kind === 'wood') {
      ctx.fillStyle = '#76513a';
      ctx.fillRect(x, platform.y, platform.width, 16);
      ctx.fillStyle = '#b08355';
      for (let plank = 0; plank < platform.width; plank += 34) ctx.fillRect(x + plank, platform.y + 2, 28, 7);
      ctx.fillStyle = '#523a2c';
      ctx.fillRect(x + 18, platform.y + 16, 8, 55);
      ctx.fillRect(x + platform.width - 26, platform.y + 16, 8, 55);
    } else if (platform.kind === 'hay') {
      ctx.fillStyle = '#c89e4f';
      ctx.fillRect(x, platform.y, platform.width, 38);
      ctx.fillStyle = '#e2bd62';
      ctx.fillRect(x + 8, platform.y - 8, platform.width - 16, 13);
    } else {
      ctx.fillStyle = '#6c5739';
      ctx.fillRect(x, platform.y, platform.width, 30);
      ctx.fillStyle = '#79974c';
      ctx.fillRect(x, platform.y, platform.width, 10);
    }
  }

  for (const mud of game.level.mud) {
    const x = Math.round(mud.start - game.cameraX);
    const width = mud.end - mud.start;
    if (x > VIEW_WIDTH || x + width < 0) continue;
    ctx.fillStyle = '#70533e';
    ctx.fillRect(x, GROUND_Y - 3, width, 28);
    ctx.fillStyle = '#9a7652';
    for (let ripple = 18; ripple < width; ripple += 74) ctx.fillRect(x + ripple, GROUND_Y + 7 + (ripple % 3) * 4, 36, 4);
  }
  for (const puddle of game.level.puddles) {
    const x = Math.round(puddle.x - game.cameraX);
    if (x > VIEW_WIDTH || x + puddle.width < 0) continue;
    ctx.fillStyle = '#5e989c';
    ctx.fillRect(x, GROUND_Y - 2, puddle.width, 8);
    ctx.fillStyle = '#a8d5cf';
    ctx.fillRect(x + 18, GROUND_Y, puddle.width * .45, 3);
  }
}

function drawMango(ctx: CanvasRenderingContext2D, mango: Mango, game: GameState) {
  const x = Math.round(mango.x - game.cameraX), y = mango.y + Math.sin(game.elapsed * 3.4 + mango.x * .01) * 5;
  sprite(ctx, 'mango', x, y + 19, 34, 42);
  if (Math.sin(game.elapsed * 5 + mango.x) > .6) { ctx.fillStyle = '#fff1b7'; ctx.fillRect(x + 17, y - 20, 4, 12); ctx.fillRect(x + 13, y - 16, 12, 4); }
}



function drawMooPing(ctx: CanvasRenderingContext2D, pickup: SpecialPickup, game: GameState) {
  const x = pickup.x - game.cameraX, y = pickup.y + Math.sin(game.elapsed * 3.5 + pickup.x) * 5;
  sprite(ctx, 'mooPing', x, y + 25, 58, 72); pixelText(ctx, 'MOO PING', x, y - 55, 22, '#fff0c2', 'center');
}

function drawMooPingStand(ctx: CanvasRenderingContext2D, x: number, y: number, wave: boolean, variant = 0) {
  sprite(ctx, 'fruitStall', x, y, 146, 112); sprite(ctx, 'person' + (variant ? 1 : 3), x + 65, y, 48, 95, wave);
}

function drawBreakable(ctx: CanvasRenderingContext2D, item: Breakable, game: GameState) {
  if (!item.active) return;
  const x = Math.round(item.x - game.cameraX);
  const top = item.y - item.height;
  if (item.kind === 'hay' && sprite(ctx, 'hay', x, item.y, item.width + 4, item.height + 5)) return;
  if (item.kind === 'crate') {
    ctx.fillStyle = '#855936';
    ctx.fillRect(x - item.width / 2, top, item.width, item.height);
    ctx.fillStyle = '#bd8750';
    ctx.fillRect(x - item.width / 2 + 7, top + 7, item.width - 14, 8);
    ctx.fillRect(x - item.width / 2 + 7, top + item.height - 15, item.width - 14, 8);
    ctx.strokeStyle = '#684329';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(x - item.width / 2 + 10, top + 10);
    ctx.lineTo(x + item.width / 2 - 10, top + item.height - 10);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#c69847';
    ctx.fillRect(x - item.width / 2, top + 8, item.width, item.height - 8);
    ctx.fillStyle = '#edc96b';
    ctx.fillRect(x - item.width / 2 + 8, top, item.width - 16, 17);
    ctx.fillStyle = '#866339';
    ctx.fillRect(x - 3, top + 8, 6, item.height - 8);
  }
}

function drawGate(ctx: CanvasRenderingContext2D, gate: Gate, game: GameState) {
  const x = Math.round(gate.x - game.cameraX);
  const leverX = Math.round(gate.leverX - game.cameraX);
  irrigationGate(ctx, x, GROUND_Y, gate.lift);
  ctx.fillStyle = '#426962';
  ctx.fillRect(leverX - 29, gate.switchY, 58, 20);
  ctx.strokeStyle = gate.open ? '#e9c660' : '#583d2f';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(leverX, gate.switchY);
  ctx.lineTo(leverX + (gate.open ? 22 : -20), gate.switchY - (gate.open ? 16 : 34));
  ctx.stroke();
  if (!gate.open) {
    pixelText(ctx, 'JUMP ↓', leverX, gate.switchY - 65 + Math.sin(game.visualTime * 5) * 4, 23, '#ccffe3', 'center');
    ctx.strokeStyle = '#9ee4c2'; ctx.lineWidth = 3;
    ctx.strokeRect(leverX - 32, gate.switchY - 3, 64, 25);
  }
}

function drawMover(ctx: CanvasRenderingContext2D, mover: MovingActor, game: GameState) {
  if (!mover.active && mover.knocked <= 0) return;
  const x = Math.round(mover.x - game.cameraX);
  const y = mover.y - Math.sin(mover.knocked * Math.PI) * 48;
  ctx.save();
  ctx.translate(x, y);
  if (mover.knocked > 0) ctx.rotate((1 - mover.knocked) * mover.dir * 0.35);
  if (mover.kind === 'fruitCart') {
    if (sprite(ctx, 'fruitCart', 0, 0, mover.width + 12, mover.height + 15)) { ctx.restore(); pixelText(ctx, '↑ RIDE', x, y - mover.height - 30, 23, '#d1ffe1', 'center'); return; }
    ctx.fillStyle = '#875533';
    ctx.fillRect(-58, -58, 116, 43);
    ctx.fillStyle = '#d89542';
    for (let i = 0; i < 6; i += 1) ctx.fillRect(-46 + i * 18, -68 - (i % 2) * 7, 12, 14);
    ctx.fillStyle = '#253331';
    ctx.beginPath(); ctx.arc(-41, -10, 13, 0, Math.PI * 2); ctx.arc(41, -10, 13, 0, Math.PI * 2); ctx.fill();
  } else if (mover.kind === 'buffalo') drawBuffalo(ctx, 0, 0, 1, Math.abs(game.player.x - mover.x) < 210);
  else drawVehicle(ctx, 0, 0, mover.kind, 1);
  ctx.restore();
  if (mover.active && (mover.kind === 'pickup' || mover.kind === 'motorbike')) {
    ctx.fillStyle = '#b95440'; ctx.fillRect(x - 18, y - 104, 36, 32);
    pixelText(ctx, '!', x, y - 88, 28, '#fff4cf', 'center');
    ctx.fillStyle = '#efd197';
    for (let i = -2; i <= 2; i++) ctx.fillRect(x + i * 22 - 7, y + 7, 13, 4);
  } else if (mover.kind === 'fruitCart') {
    pixelText(ctx, '↑ RIDE', x, y - 98, 23, '#d1ffe1', 'center');
  }
}

function drawCoconut(ctx: CanvasRenderingContext2D, coconut: Coconut, game: GameState) {
  const x = Math.round(coconut.x - game.cameraX);
  if (!coconut.landed) {
    ctx.fillStyle = coconut.timer > .45 ? '#f4cf65' : '#5f7036';
    ctx.fillRect(x - 12, coconut.y - 12, 24, 24);
    ctx.fillStyle = '#344a31';
    ctx.fillRect(x - 6, coconut.y - 7, 4, 4);
    if (coconut.triggered && coconut.timer < 1.35) pixelText(ctx, '!', x, coconut.y - 31, 18, '#ffe37d', 'center');
  }
}

function drawBridgeBoards(ctx: CanvasRenderingContext2D, game: GameState) {
  for (const board of game.bridgeBoards) {
    const x = Math.round(board.x - game.cameraX);
    if (x < -80 || x > VIEW_WIDTH + 80 || board.drop > 210) continue;
    const wobble = board.timer > 0 ? Math.sin(game.elapsed * 24 + board.x) * Math.min(5, board.timer * 7) : 0;
    ctx.save();
    ctx.translate(x + board.width / 2, board.y + board.drop);
    ctx.rotate(wobble * .008);
    ctx.fillStyle = '#93663f';
    ctx.fillRect(-board.width / 2 + 2, 0, board.width - 4, 15);
    ctx.fillStyle = '#c09059';
    ctx.fillRect(-board.width / 2 + 8, 3, board.width - 16, 5);
    ctx.restore();
  }
}

function drawChicken(ctx: CanvasRenderingContext2D, chicken: Chicken, game: GameState) {
  if (!chicken.active && chicken.bounce <= 0) return;
  const x = Math.round(chicken.x - game.cameraX), sleeping = chicken.behavior === 'sleep' && chicken.alert <= 0;
  const hop = chicken.bounce > 0 ? Math.sin((1 - chicken.bounce) * Math.PI * 5) * 34 : sleeping ? 0 : Math.abs(Math.sin(game.elapsed * 5 + chicken.originX)) * 5;
  const y = chicken.y - hop;
  sprite(ctx, game.level.id === 1 ? 'goose' : 'chicken', x, y, 65, game.level.id === 1 ? 81 : 65, chicken.dir === 1);
  if (sleeping) pixelText(ctx, 'z z', x + 20, y - 70, 18, '#fff2c5', 'center');
  if (dangerousChicken(chicken)) { ctx.fillStyle = '#ba463a'; ctx.fillRect(x - 16, y - 41, 24, 7); pixelText(ctx, '!', x, y - 95, 30, '#ffe477', 'center'); }
}

function drawPlayer(ctx: CanvasRenderingContext2D, game: GameState, mode: GameMode) {
  const player = game.player;
  const x = Math.round(player.x - game.cameraX);
  const run = player.grounded && Math.abs(player.vx) > 20;
  const hurtFlash = player.hurtTimer > 0 && Math.floor(player.hurtTimer * 12) % 2 === 0;
  if (hurtFlash) return;
  const superOn = game.superTimer > 0;
  if (game.power?.kind === 'shield') {
    ctx.strokeStyle = '#bbf3e7'; ctx.lineWidth = 4; ctx.fillStyle = '#b5f7ee20';
    ctx.beginPath(); ctx.ellipse(x, player.y - 65, 79, 88, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  if (game.power?.kind === 'magnet') {
    ctx.strokeStyle = '#f0bcd49c'; ctx.lineWidth = 3; ctx.setLineDash([6, 12]);
    ctx.beginPath(); ctx.ellipse(x, player.y - 52, 100 + Math.sin(game.visualTime * 5) * 9, 73, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
  }
  if (game.power?.kind === 'bike' && sprite(ctx, 'rider', x, player.y + 2, 188, 167, player.facing === 1)) {
    if (Math.abs(player.vx) > 100) {
      ctx.strokeStyle = '#e6d5ac'; ctx.lineWidth = 3;
      for (const wheel of [-57, 63]) { const a = game.visualTime * Math.abs(player.vx) * .13; ctx.beginPath(); ctx.moveTo(x + wheel - Math.cos(a) * 11, player.y - 16 - Math.sin(a) * 11); ctx.lineTo(x + wheel + Math.cos(a) * 11, player.y - 16 + Math.sin(a) * 11); ctx.stroke(); }
      for (let i = 0; i < 3; i++) { ctx.fillStyle = '#eee3b590'; ctx.fillRect(x - player.facing * (115 + i * 13), player.y - 45 - i * 16, 22, 3); }
    }
    return;
  }
  if (buffaloAtlas?.complete && buffaloAtlas.naturalWidth) {
    const victory = mode === 'won' || game.finishTimer > 0;
    const frame = victory ? 7 : player.hurtTimer > 1.12 && player.knockback > 0 ? 6 : player.landTimer > 0 ? 5 : !player.grounded ? (player.vy < 0 ? 3 : 4) : run ? 1 + Math.floor(player.animation * (superOn ? 12 : Math.abs(player.vx) < 140 ? 5 : 8)) % 2 : 0;
    const sx = frame % 4 * 192, sy = Math.floor(frame / 4) * 192;
    const bob = run ? Math.sin(player.animation * 16) * 2 : Math.sin(game.visualTime * 2) * 1.1;
    ctx.save(); ctx.translate(x, Math.round(player.y + bob)); ctx.scale(player.facing, 1);
    if (superOn && buffaloOutline) {
      for (const [dx, dy] of [[-3, 0], [3, 0], [0, -3], [0, 3]]) ctx.drawImage(buffaloOutline, sx, sy, 192, 192, -96 + dx, -176 + dy, 192, 192);
    }
    ctx.drawImage(buffaloAtlas, sx, sy, 192, 192, -96, -176, 192, 192);
    if (!victory) {
      // Small pixel-stepped tail flick and ear twitch give the idle pose life.
      const flick = Math.round(Math.sin(game.visualTime * 4) * 4);
      ctx.fillStyle = '#434238'; ctx.fillRect(-62, -47, 4, 6); ctx.fillRect(-65, -43 + flick, 4, 8);
      if (!run && game.visualTime % 4 > 3.75) { ctx.fillStyle = '#ad8870'; ctx.fillRect(-7, -73, 10, 3); }
    }
    if (player.doubleTimer > 0) {
      ctx.fillStyle = '#fff2ab';
      for (const [dx, dy] of [[-48, -35], [32, -103], [64, -20]]) { ctx.fillRect(dx - 5, dy, 14, 4); ctx.fillRect(dx, dy - 5, 4, 14); }
    }
    if (game.power?.kind === 'flight') {
      ctx.fillStyle = '#ffbe79'; ctx.fillRect(-28, -71, 43, 6);
    }
    if (game.power?.kind === 'fire') {
      ctx.fillStyle = '#ed8656'; ctx.fillRect(62, -52, 8, 6);
    }
    if (game.eatTimer > 0) {
      ctx.fillStyle = '#b56437'; ctx.fillRect(61, -48, 18, 9);
      ctx.fillStyle = '#e5c29b'; ctx.fillRect(61, -43, 27, 3);
    }
    if (!run && player.grounded && !victory && game.visualTime % 5 > 4.84) {
      ctx.fillStyle = '#2a2b25'; ctx.fillRect(31, -65, 7, 4);
    }
    ctx.restore(); return;
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, game: GameState) {
  for (const particle of game.particles) {
    const x = Math.round(particle.x - game.cameraX);
    ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.fillRect(x, Math.round(particle.y), particle.size, particle.size);
  }
  ctx.globalAlpha = 1;
}

function drawWeatherAndLife(ctx: CanvasRenderingContext2D, game: GameState) {
  ctx.strokeStyle = '#d8e4df';
  ctx.lineWidth = 2;
  ctx.globalAlpha = (game.level.id === 1 || (game.level.id === 0 && game.player.x > 13600 && game.player.x < 16000)) ? .38 : 0;
  for (let index = 0; index < 38; index += 1) {
    const x = (index * 127 + game.elapsed * 210) % (VIEW_WIDTH + 140) - 70;
    const y = (index * 83 + game.elapsed * 360) % 520;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 8, y + 18);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  ctx.strokeStyle = '#25483f';
  ctx.lineWidth = 4;
  const birdShift = (game.elapsed * 18) % 120;
  for (let index = 0; index < 4; index += 1) {
    const x = 170 + index * 190 - birdShift;
    const worldBirdX = game.cameraX + x;
    const startled = Math.abs(game.player.x - worldBirdX) < 180;
    const y = 170 + (index % 2) * 42 - (startled ? 65 : 0);
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.lineTo(x, y - 7);
    ctx.lineTo(x + 10, y);
    ctx.stroke();
  }
}

function drawPowerPickup(ctx: CanvasRenderingContext2D, pickup: PowerPickup, game: GameState) {
  const y = pickup.y + Math.sin(game.visualTime * 3 + pickup.x) * 5, x = pickup.x - game.cameraX;
  sprite(ctx, POWER_ART[pickup.kind], x, y + 34, 74, 84);
  const labels = { durian: 'DURIAN', flight: 'CHA YEN', fire: 'MALA', double: 'STICKY RICE', bike: 'DELIVERY!', shield: 'SHIELD', magnet: 'KHANOM' };
  pixelText(ctx, labels[pickup.kind], x, y - 63, 22, '#fff2bf', 'center');
  ctx.fillStyle = '#fff2ad'; ctx.fillRect(x + 42, y - 26, 4, 15); ctx.fillRect(x + 37, y - 21, 14, 4);
}

function drawSecretsAndCheckpoints(ctx: CanvasRenderingContext2D, game: GameState) {
  for (let i = 1; i < game.level.checkpoints.length; i++) {
    const x = game.level.checkpoints[i].x - game.cameraX;
    if (x < -90 || x > VIEW_WIDTH + 90) continue;
    ctx.fillStyle = '#6f5138'; ctx.fillRect(x - 3, GROUND_Y - 120, 7, 120);
    ctx.fillStyle = i <= game.checkpoint ? '#b8e4b8' : '#f2d58f';
    ctx.beginPath(); ctx.moveTo(x + 4, GROUND_Y - 117); ctx.lineTo(x + 51, GROUND_Y - 111 + Math.sin(game.visualTime * 4) * 4); ctx.lineTo(x + 42, GROUND_Y - 83); ctx.lineTo(x + 4, GROUND_Y - 85); ctx.fill();
    pixelText(ctx, i <= game.checkpoint ? '✓' : 'CP', x + 25, GROUND_Y - 100, 21, '#16392e', 'center');
  }
  const gold = game.goldenMango;
  if (!gold.collected && Math.abs(gold.x - game.cameraX - 480) < 550) {
    const x = gold.x - game.cameraX, y = gold.y + Math.sin(game.visualTime * 3) * 6;
    ctx.save(); ctx.shadowColor = '#ffdc68'; ctx.shadowBlur = 16;
    sprite(ctx, 'mango', x, y + 31, 64, 64);
    ctx.restore();
    for (let i = 0; i < 5; i++) {
      const a = game.visualTime + i * Math.PI * .4, sx = x + Math.cos(a) * 45, sy = y + Math.sin(a) * 40;
      ctx.fillStyle = '#fff0a2'; ctx.fillRect(sx - 6, sy - 2, 12, 4); ctx.fillRect(sx - 2, sy - 6, 4, 12);
    }
  }
  for (const target of game.targets) {
    if (!target.active) continue;
    const x = target.x - game.cameraX;
    ctx.fillStyle = '#6d4c33'; ctx.fillRect(x - 5, target.y, 10, GROUND_Y - target.y);
    ctx.fillStyle = '#df9670'; ctx.fillRect(x - 26, target.y - 26, 52, 52);
    ctx.fillStyle = '#ffe0a9'; ctx.fillRect(x - 18, target.y - 18, 36, 36);
    ctx.fillStyle = '#b9563c'; ctx.fillRect(x - 8, target.y - 8, 16, 16);
    pixelText(ctx, 'MALA →', x, target.y - 47, 22, '#ffdfae', 'center');
  }
  for (const shot of game.fireballs) {
    const x = shot.x - game.cameraX, direction = Math.sign(shot.vx);
    ctx.fillStyle = '#e67b41'; ctx.fillRect(x - direction * 20 - 8, shot.y - 7, 28, 14);
    ctx.fillStyle = '#ffbc56'; ctx.fillRect(x - 9, shot.y - 10, 19, 20);
    ctx.fillStyle = '#fff1af'; ctx.fillRect(x - 5, shot.y - 5, 10, 10);
  }
}

function drawCrowd(ctx: CanvasRenderingContext2D, game: GameState) {
  const finish = game.level.finishX;
  if (game.player.x < finish - 900) return;
  drawBuilding(ctx, finish + 40 - game.cameraX, GROUND_Y - 15);
  const count = 4 + game.level.id;
  const order = [0, 1, 2, 3, 4, 5].sort((a, b) => cosmetic(game.cosmeticSeed, a + 130) - cosmetic(game.cosmeticSeed, b + 130));
  for (let i = 0; i < count; i++) {
    const variant = order[i];
    const x = finish - 215 + i * (game.level.id === 2 ? 80 : 90) + cosmetic(game.cosmeticSeed, i + 220) * 12 - game.cameraX;
    const bob = game.finishTimer > 0 ? Math.max(0, Math.sin(game.visualTime * (6 + i % 3) + i)) * 16 : Math.sin(game.visualTime * 2 + i) * 2;
    ctx.save(); ctx.translate(x, GROUND_Y - bob); ctx.rotate(game.finishTimer > 0 ? Math.sin(game.visualTime * 6 + i) * .055 : 0);
    person(ctx, variant, 0, 0, 65, 130, game.finishTimer > 0 ? (['wave', 'clap', 'raise'] as const)[i % 3] : 'wave', game.visualTime + i); ctx.restore();
  }
}

function drawHud(ctx: CanvasRenderingContext2D, game: GameState) {
  // Text/status use a real responsive DOM layer. Canvas only adds the ambient
  // milestone phrase so it never intercepts a gesture.
  if (game.encouragement && game.finishTimer <= 0) {
    const remaining = game.encouragement.remaining;
    ctx.save(); ctx.globalAlpha = Math.min(1, remaining * 2, (2.8 - remaining) * 5);
    const y = 180 - (2.8 - remaining) * 7;
    ctx.fillStyle = 'rgba(20,52,40,.91)'; ctx.fillRect(178, y - 38, 604, 108);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '700 38px Tahoma, "Leelawadee UI", sans-serif';
    ctx.fillStyle = '#fff2bf'; ctx.fillText(game.encouragement.thai, 480, y);
    ctx.font = '600 23px Arial, sans-serif'; ctx.fillStyle = '#e3dcc0';
    ctx.fillText(game.encouragement.roman, 480, y + 40); ctx.restore();
  }
}

function drawGame(ctx: CanvasRenderingContext2D, game: GameState, mode: GameMode) {
  ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  ctx.imageSmoothingEnabled = false;
  drawSky(ctx, game);
  drawParallax(ctx, game);
  drawMountain(ctx, game);
  drawWeatherAndLife(ctx, game);
  drawScenery(ctx, game);
  drawTerrain(ctx, game);
  drawBridgeBoards(ctx, game);
  for (const gate of game.gates) {
    if (gate.x > game.cameraX - 120 && gate.x < game.cameraX + VIEW_WIDTH + 120) drawGate(ctx, gate, game);
  }
  for (const item of game.breakables) {
    if (item.x > game.cameraX - 100 && item.x < game.cameraX + VIEW_WIDTH + 100) drawBreakable(ctx, item, game);
  }
  for (const mover of game.movers) {
    if (mover.x > game.cameraX - 180 && mover.x < game.cameraX + VIEW_WIDTH + 180) drawMover(ctx, mover, game);
  }
  for (const coconut of game.coconuts) {
    if (coconut.x > game.cameraX - 80 && coconut.x < game.cameraX + VIEW_WIDTH + 80) drawCoconut(ctx, coconut, game);
  }
  for (const pickup of game.powerups) {
    if (!pickup.collected && pickup.x > game.cameraX - 60 && pickup.x < game.cameraX + VIEW_WIDTH + 60) drawPowerPickup(ctx, pickup, game);
  }
  for (const pickup of game.mooPings) {
    if (!pickup.collected && pickup.x > game.cameraX - 60 && pickup.x < game.cameraX + VIEW_WIDTH + 60) drawMooPing(ctx, pickup, game);
  }
  for (const mango of game.mangoes) {
    if (!mango.collected && !mango.hidden && mango.x > game.cameraX - 40 && mango.x < game.cameraX + VIEW_WIDTH + 40) drawMango(ctx, mango, game);
  }
  for (const chicken of game.chickens) {
    if (chicken.x > game.cameraX - 60 && chicken.x < game.cameraX + VIEW_WIDTH + 60) drawChicken(ctx, chicken, game);
  }
  drawSecretsAndCheckpoints(ctx, game);
  drawCrowd(ctx, game);
  drawPlayer(ctx, game, mode);
  drawParticles(ctx, game);

  ctx.fillStyle = '#3d653f';
  for (let index = 0; index < 23; index += 1) {
    const x = ((index * 53 - game.cameraX * 0.9) % 1250) - 40;
    ctx.fillRect(Math.round(x), 666 - (index % 3) * 8, 7, 54);
    ctx.fillRect(Math.round(x - 7), 677 - (index % 3) * 8, 18, 5);
  }
  drawHud(ctx, game);
}

export default function BuffaloBoyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [initialGame] = useState(() => createGame());
  const gameRef = useRef<GameState>(initialGame);
  const controlsRef = useRef({ left: false, right: false, jumpHeld: false, jumpPressed: false });
  const pointerOwnersRef = useRef(new Map<number, 'left' | 'right' | 'jump'>());
  const mousePointersRef = useRef(new Set<number>());
  const keyboardOwnersRef = useRef(new Set<'left' | 'right' | 'jump'>());
  const modeRef = useRef<GameMode>('intro');
  const audioRef = useRef<AudioContext | null>(null);
  const soundOnRef = useRef(true);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastProgressRef = useRef(0);
  const lastLivesRef = useRef(3);
  const lastMangoRef = useRef(0);
  const [mode, setModeState] = useState<GameMode>('intro');
  const [adventure, setAdventure] = useState(freshAdventure);
  const [lastResult, setLastResult] = useState<LevelResult | null>(null);
  const [levelId, setLevelId] = useState(0);
  const level = LEVELS[levelId];
  const earnedStamps = adventureStamps(adventure);
  const complete = adventure.every(Boolean);
  const totalMangoes = adventure.reduce((sum, r) => sum + (r?.mangoes ?? 0), 0);
  const totalPossible = LEVELS.reduce((sum, l) => sum + l.mangoSeeds.length + l.secretMangoes.length, 0);
  const [soundOn, setSoundOn] = useState(true);
  const [artReady, setArtReady] = useState(false);
  const [artFailed, setArtFailed] = useState(false);
  const [mangoCount, setMangoCount] = useState(0);
  const [lives, setLives] = useState(3);
  const [progress, setProgress] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hud, setHud] = useState({ section: 'Morning Rice Fields', power: '', instruction: '', time: 0, duration: 1, color: '#eab764', message: '', x: 220, y: GROUND_Y, checkpoint: 0, encouraging: false, gold: false, secrets: 0, completion: 0, controls: '', replay: false });
  const hudClockRef = useRef(0);
  const [qaEnabled, setQaEnabled] = useState(false);
  const qaApiRef = useRef<typeof import('./buffalo-boy/qa-driver') | null>(null);
  const qaDriverRef = useRef<RouteDriver | null>(null);
  useEffect(() => {
    // Explicit local-only test controls; excluded from the published experience.
    if (process.env.NODE_ENV === 'development' && new URLSearchParams(window.location.search).has('buffalo-qa')) {
      void import('./buffalo-boy/qa-driver').then(api => { qaApiRef.current = api; setQaEnabled(true); });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    const playerReady = new Promise<void>((resolve, reject) => {
    image.onload = () => {
      buffaloAtlas = image;
      const outline = document.createElement('canvas');
      outline.width = image.naturalWidth; outline.height = image.naturalHeight;
      const context = outline.getContext('2d');
      if (context) { context.drawImage(image, 0, 0); context.globalCompositeOperation = 'source-in'; context.fillStyle = '#ffe274'; context.fillRect(0, 0, outline.width, outline.height); buffaloOutline = outline; }
      resolve();
    };
    image.onerror = () => reject(new Error('Buffalo artwork did not load'));
    image.src = '/game/buffalo-poses-v2.png';
    });
    void Promise.all([loadArt(), playerReady]).then(() => { if (!cancelled) setArtReady(true); }).catch(() => { if (!cancelled) setArtFailed(true); });
    return () => { cancelled = true; image.onload = null; image.onerror = null; };
  }, []);

  const setMode = (next: GameMode) => {
    modeRef.current = next;
    setModeState(next);
  };

  const playSfx = (kind: Sfx) => {
    if (!soundOnRef.current || typeof window === 'undefined') return;
    const context = audioRef.current;
    if (!context || context.state === 'closed') return;
    if (context.state === 'suspended') void context.resume().catch(() => {});
    const now = context.currentTime;
    const notes: Record<Sfx, Array<[number, number, OscillatorType]>> = {
      jump: [[270, 0.08, 'square'], [370, 0.08, 'square']],
      mango: [[520, 0.06, 'square'], [760, 0.1, 'triangle']],
      stomp: [[150, 0.07, 'square'], [220, 0.08, 'triangle']],
      splash: [[110, 0.13, 'sine'], [85, 0.15, 'sine']],
      hurt: [[180, 0.12, 'sawtooth'], [115, 0.16, 'sawtooth']],
      checkpoint: [[330, 0.1, 'triangle'], [440, 0.1, 'triangle'], [660, 0.16, 'triangle']],
      victory: [[392, 0.12, 'square'], [523, 0.12, 'square'], [659, 0.14, 'square'], [784, 0.28, 'triangle']],
      durian: [[220, 0.07, 'square'], [440, 0.08, 'square'], [660, 0.1, 'triangle'], [880, 0.16, 'triangle']],
      mooPing: [[330, 0.08, 'triangle'], [494, 0.08, 'triangle'], [587, 0.15, 'sine']],
      smash: [[95, 0.08, 'sawtooth'], [145, 0.12, 'square']],
      switch: [[260, 0.08, 'square'], [520, 0.12, 'triangle']],
      flight: [[330, .1, 'sine'], [660, .16, 'triangle']],
      fire: [[180, .08, 'square'], [420, .13, 'triangle']],
      double: [[460, .06, 'triangle'], [920, .13, 'sine']],
      golden: [[523, .12, 'triangle'], [659, .12, 'triangle'], [1047, .3, 'sine']],
      fireball: [[210, .05, 'triangle'], [140, .07, 'sine']],
      encouragement: [[392, .08, 'triangle'], [587, .16, 'triangle']],
      secret: [[440, .08, 'triangle'], [554, .08, 'triangle'], [880, .2, 'sine']],
      bike: [[130, .07, 'sawtooth'], [196, .1, 'triangle'], [330, .12, 'triangle']],
      shield: [[440, .12, 'sine'], [660, .2, 'sine']],
      magnet: [[523, .09, 'sine'], [698, .09, 'sine'], [880, .16, 'triangle']],
      shieldBreak: [[660, .08, 'sine'], [330, .14, 'triangle']],
      engine: [[78, .06, 'triangle'], [90, .06, 'triangle']],
      levelFinish: [[392, .1, 'triangle'], [523, .12, 'triangle'], [659, .25, 'sine']],
    };
    let offset = 0;
    for (const [frequency, duration, type] of notes[kind]) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now + offset);
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.035, now + offset + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + duration + 0.02);
      offset += duration * 0.72;
    }
  };

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const syncHeldControls = () => {
    const pointers = [...pointerOwnersRef.current.values()];
    controlsRef.current.left = keyboardOwnersRef.current.has('left') || pointers.includes('left');
    controlsRef.current.right = keyboardOwnersRef.current.has('right') || pointers.includes('right');
    controlsRef.current.jumpHeld = keyboardOwnersRef.current.has('jump') || pointers.includes('jump');
  };

  useEffect(() => {
    const clearControls = () => {
      pointerOwnersRef.current.clear();
      mousePointersRef.current.clear();
      keyboardOwnersRef.current.clear();
      controlsRef.current.left = false;
      controlsRef.current.right = false;
      controlsRef.current.jumpHeld = false;
      controlsRef.current.jumpPressed = false;
    };
    const releasePointer = (event: PointerEvent) => {
      pointerOwnersRef.current.delete(event.pointerId);
      mousePointersRef.current.delete(event.pointerId);
      syncHeldControls();
    };
    const releaseMouse = () => {
      // Some embedded browsers deliver a compatibility mouseup after retargeting.
      for (const id of mousePointersRef.current) pointerOwnersRef.current.delete(id);
      mousePointersRef.current.clear();
      syncHeldControls();
    };
    const reconcileMouse = (event: PointerEvent) => {
      // Recover even if an embedded browser misses a release during a resize.
      // Touch owners are independent: simultaneous movement + jump stays intact.
      if (event.pointerType === 'mouse' && event.buttons === 0) releaseMouse();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (modeRef.current !== 'playing') return;
      if (!(event.target instanceof Element) || !event.target.closest('[data-game-input]')) return;
      const key = event.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') { keyboardOwnersRef.current.add('left'); controlsRef.current.left = true; }
      else if (key === 'arrowright' || key === 'd') { keyboardOwnersRef.current.add('right'); controlsRef.current.right = true; }
      else if (key === ' ' || key === 'arrowup' || key === 'w') {
        keyboardOwnersRef.current.add('jump');
        if (!controlsRef.current.jumpHeld) controlsRef.current.jumpPressed = true;
        controlsRef.current.jumpHeld = true;
      } else return;
      event.preventDefault();
    };
    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') { keyboardOwnersRef.current.delete('left'); controlsRef.current.left = [...pointerOwnersRef.current.values()].includes('left'); }
      else if (key === 'arrowright' || key === 'd') { keyboardOwnersRef.current.delete('right'); controlsRef.current.right = [...pointerOwnersRef.current.values()].includes('right'); }
      else if (key === ' ' || key === 'arrowup' || key === 'w') { keyboardOwnersRef.current.delete('jump'); controlsRef.current.jumpHeld = [...pointerOwnersRef.current.values()].includes('jump'); }
      else return;
      if (modeRef.current === 'playing') event.preventDefault();
    };
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp, { passive: false });
    window.addEventListener('blur', clearControls);
    window.addEventListener('resize', clearControls);
    // Capture the release even when a browser retargets it outside the button.
    window.addEventListener('pointerup', releasePointer, true);
    window.addEventListener('pointercancel', releasePointer, true);
    window.addEventListener('mouseup', releaseMouse, true);
    window.addEventListener('pointermove', reconcileMouse, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearControls);
      window.removeEventListener('resize', clearControls);
      window.removeEventListener('pointerup', releasePointer, true);
      window.removeEventListener('pointercancel', releasePointer, true);
      window.removeEventListener('mouseup', releaseMouse, true);
      window.removeEventListener('pointermove', reconcileMouse, true);
    };
  }, []);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden && modeRef.current === 'playing') {
        pointerOwnersRef.current.clear();
        mousePointersRef.current.clear();
        keyboardOwnersRef.current.clear();
        controlsRef.current = { left: false, right: false, jumpHeld: false, jumpPressed: false };
        setMode('paused');
      }
    };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => document.removeEventListener('visibilitychange', pauseWhenHidden);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let frame = 0;
    let previous = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.033, Math.max(0, (time - previous) / 1000));
      previous = time;
      const game = gameRef.current;
      if (modeRef.current === 'playing') {
        const controls = qaDriverRef.current && qaApiRef.current ? qaApiRef.current.routeInput(game, qaDriverRef.current, dt) : controlsRef.current;
        updateGame(game, controls, dt, playSfx);
        const progress = Math.floor(game.player.x / game.level.finishX * 20) * 5;
        if (progress !== lastProgressRef.current || game.lives !== lastLivesRef.current || game.mangoCount !== lastMangoRef.current) {
          lastProgressRef.current = progress;
          lastLivesRef.current = game.lives;
          lastMangoRef.current = game.mangoCount;
          setProgress(progress);
          setLives(game.lives);
          setMangoCount(game.mangoCount);
        }
        hudClockRef.current += dt;
        if (hudClockRef.current > .1) {
          hudClockRef.current = 0;
          const power = game.power ? POWER_META[game.power.kind] : null;
          setHud({ section: sectionAt(game.player.x, game.level), power: power?.label ?? '', instruction: power?.instruction ?? '',
            time: game.power?.remaining ?? 0, duration: power?.duration ?? 1, color: power?.color ?? '#eab764',
            message: game.messageTimer > 0 ? game.message : '', x: game.player.x, y: game.player.y, checkpoint: game.checkpoint,
            encouraging: Boolean(game.encouragement), gold: game.goldenMango.collected, secrets: game.secrets.length, completion: game.completionTime,
            controls: [controlsRef.current.left ? 'LEFT' : '', controlsRef.current.right ? 'RIGHT' : '', controlsRef.current.jumpHeld ? 'JUMP' : ''].filter(Boolean).join(' ') || 'released', replay: Boolean(qaDriverRef.current) });
        }
        if (game.finishTimer >= 3.2) {
          const result = resultFor(game); setLastResult(result);
          setAdventure(previous => recordResult(previous, result));
          setHud(previous => ({ ...previous, x: game.player.x, y: game.player.y, gold: result.gold, completion: result.seconds, secrets: result.secrets }));
          setMangoCount(game.mangoCount); setMode('won');
          pointerOwnersRef.current.clear(); mousePointersRef.current.clear(); keyboardOwnersRef.current.clear();
          controlsRef.current = { left: false, right: false, jumpHeld: false, jumpPressed: false };
        }
      }
      else { game.visualTime += dt * .6; game.player.animation += dt * .5; animateParticles(game, dt); }
      drawGame(ctx, game, modeRef.current);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => () => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    const context = audioRef.current;
    audioRef.current = null;
    if (context && context.state !== 'closed') void context.close().catch(() => {});
  }, []);

  const begin = (nextLevel = 0) => {
    if (soundOnRef.current && (!audioRef.current || audioRef.current.state === 'closed')) audioRef.current = new AudioContext();
    if (audioRef.current?.state === 'suspended') void audioRef.current.resume().catch(() => {});
    gameRef.current = createGame(undefined, nextLevel);
    setLevelId(nextLevel); setLastResult(null);
    setHud(previous => ({ ...previous, section: LEVELS[nextLevel].sections[0].name, power: '', message: '', x: 220, y: GROUND_Y, gold: false, checkpoint: 0, secrets: 0, completion: 0 }));
    pointerOwnersRef.current.clear();
    mousePointersRef.current.clear();
    keyboardOwnersRef.current.clear();
    qaDriverRef.current = null;
    controlsRef.current = { left: false, right: false, jumpHeld: false, jumpPressed: false };
    lastProgressRef.current = 0;
    lastLivesRef.current = 3; lastMangoRef.current = 0;
    setMangoCount(0);
    setLives(3);
    setProgress(0);
    setMode('playing');
    setShowHint(true);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setShowHint(false), 2600);
    canvasRef.current?.focus({ preventScroll: true });
  };

  const resume = () => {
    pointerOwnersRef.current.clear();
    mousePointersRef.current.clear();
    keyboardOwnersRef.current.clear();
    controlsRef.current = { left: false, right: false, jumpHeld: false, jumpPressed: false };
    setMode('playing');
    canvasRef.current?.focus({ preventScroll: true });
  };

  const toggleSound = () => {
    if (!audioRef.current || audioRef.current.state === 'closed') audioRef.current = new AudioContext();
    setSoundOn(current => {
      const next = !current;
      soundOnRef.current = next;
      if (next) playSfx('mango');
      return next;
    });
  };

  const pressControl = (control: 'left' | 'right' | 'jump', event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (modeRef.current !== 'playing') return;
    const jumpWasHeld = controlsRef.current.jumpHeld;
    if (event.pointerType === 'mouse') {
      for (const id of mousePointersRef.current) pointerOwnersRef.current.delete(id);
      mousePointersRef.current.clear();
    }
    pointerOwnersRef.current.set(event.pointerId, control);
    if (event.pointerType === 'mouse') mousePointersRef.current.add(event.pointerId);
    event.currentTarget.setPointerCapture(event.pointerId);
    syncHeldControls();
    if (control === 'jump' && !jumpWasHeld) controlsRef.current.jumpPressed = true;
  };

  const releaseControl = (control: 'left' | 'right' | 'jump', event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (pointerOwnersRef.current.get(event.pointerId) === control) {
      pointerOwnersRef.current.delete(event.pointerId);
      mousePointersRef.current.delete(event.pointerId);
    }
    // Preserve a queued tap until the next animation frame, even on fast touch-up.
    syncHeldControls();
  };

  const runLocalCheck = (scenario: 'route' | 'wetlands' | 'town' | 'bike' | 'shield' | 'magnet' | 'truck' | 'mountain' | 'finish' | 'flight' | 'double' | 'fire') => {
    if (process.env.NODE_ENV !== 'development' || !qaApiRef.current) return;
    begin(['town', 'bike', 'magnet'].includes(scenario) ? 2 : ['wetlands', 'shield'].includes(scenario) ? 1 : 0);
    const game = gameRef.current;
    const starts = { route: 220, wetlands: 220, town: 220, bike: 4440, shield: 870, magnet: 640, truck: 11560, mountain: 10100, finish: 21100, flight: 6680, double: 8910, fire: 12650 };
    game.player.x = starts[scenario]; game.cameraX = Math.max(0, game.player.x - VIEW_WIDTH * .36);
    if (scenario === 'truck') game.powerups.forEach(p => { p.collected = true; });
    if (['route', 'wetlands', 'town'].includes(scenario)) qaDriverRef.current = qaApiRef.current.createDriver();
  };

  return (
    <section id="buffalo-boy" className={styles.section} aria-labelledby="buffalo-boy-title" onClick={event => event.stopPropagation()}>
      <div className={`shell ${styles.shell}`}>
        <header className={styles.heading}>
          <div>
            <p className={styles.kicker}>A LITTLE PLAYABLE DETOUR</p>
            <h2 id="buffalo-boy-title">Buffalo Boy.<br/><em>A Phatthalung adventure.</em></h2>
          </div>
          <p>Three little journeys through rice fields, Thale Noi’s wetlands, and the town market. Collect mangoes, discover local treats, meet friendly faces, and find a warm welcome at every stop.</p>
        </header>

        {process.env.NODE_ENV === 'development' && qaEnabled && <div className={styles.qaPanel} aria-label="Local test controls">
          <strong>LOCAL QA · not part of the published site</strong>
          {(['route', 'wetlands', 'town', 'bike', 'shield', 'magnet', 'truck', 'mountain', 'finish', 'flight', 'double', 'fire'] as const).map(name => <button key={name} type="button" onClick={() => runLocalCheck(name)}>Test {name}</button>)}
          <button type="button" onClick={() => { qaDriverRef.current = null; }}>Manual controls</button>
          <button type="button" onClick={() => { if (modeRef.current === 'playing' && qaApiRef.current) qaDriverRef.current = qaApiRef.current.createDriver(); }}>Drive this level</button>
          <output aria-label="Test input status">{hud.replay ? 'REPLAY' : 'MANUAL'} · {hud.controls} · x {Math.round(hud.x)} · y {Math.round(hud.y)}</output>
        </div>}

        <div className={styles.gameCard} data-game-input onContextMenu={event => event.preventDefault()} onDragStart={event => event.preventDefault()}>
          <div className={styles.gameBar}>
            <div><span className={styles.statusDot}/><strong>BUFFALO BOY</strong><small>{level.name.toUpperCase()}</small></div>
            <button type="button" className={styles.soundButton} onClick={toggleSound} aria-pressed={soundOn} aria-label={soundOn ? 'Turn game sound off' : 'Turn game sound on'}>
              <span aria-hidden="true">{soundOn ? 'SOUND ON' : 'SOUND OFF'}</span>
            </button>
          </div>

            {mode !== 'intro' && mode !== 'map' && <div className={styles.hud} aria-hidden="true">
              <div className={styles.hudTop}><b><img src="/game/mango.png" alt="" width="22" height="25"/> {mangoCount}/{level.mangoSeeds.length + level.secretMangoes.length}</b><span className={styles.hearts}>{'♥'.repeat(lives)}<i>{'♡'.repeat(3 - lives)}</i></span><span>L{levelId + 1} · {hud.section}</span></div>
              <div className={styles.journey}><span>START</span><div><i style={{ width: `${clamp(hud.x / level.finishX * 100, 0, 100)}%` }}/>{levelId === 0 && <b className={styles.mountainMarker}>△</b>}<b style={{ left: `${clamp(hud.x / level.finishX * 100, 0, 100)}%` }}>●</b></div><span>FINISH</span></div>
              {hud.power && <div className={styles.powerHud} style={{ borderColor: hud.color }}><strong style={{ color: hud.color }}><img className={styles.powerIcon} src={'/game/' + POWER_ART[(Object.keys(POWER_META) as PowerKind[]).find(kind => POWER_META[kind].label === hud.power) ?? 'durian'] + '.png'} alt="" width="26" height="30"/>{hud.power}<span>{Math.ceil(hud.time)}s</span></strong><div><i style={{ width: `${hud.time / hud.duration * 100}%`, background: hud.color }}/></div><small>{hud.instruction}</small></div>}
              {!hud.power && <p className={styles.hudRest}>{mode === 'won' ? 'A little journey, a warm welcome.' : 'Follow the road · look for little surprises'}</p>}
            </div>}
          <div className={`${styles.viewport} ${mode === 'playing' ? styles.viewportPlaying : ''} ${mode === 'map' ? styles.mapViewport : ''}`}>
            <canvas ref={canvasRef} width={VIEW_WIDTH} height={VIEW_HEIGHT} className={styles.canvas} tabIndex={0} aria-label="Buffalo Boy side-scrolling game through Phatthalung"/>
            {mode === 'playing' && hud.message && !hud.encouraging && <p className={styles.gameMessage}>{hud.message}</p>}
            {showHint && mode === 'playing' && <div className={styles.controlHint}>MOVE ← → &nbsp;•&nbsp; JUMP</div>}
            {mode === 'intro' && (
              <div className={styles.overlay}>
                <p>PHATTHALUNG ADVENTURE</p>
                <h3>Buffalo Boy</h3>
                <strong>Take a little trip through Phatthalung.</strong>
                <button type="button" disabled={!artReady} onClick={() => begin(0)}>{artReady ? 'Start Adventure →' : artFailed ? 'Please reload to load the artwork' : 'Getting the journey ready…'}</button>
                <small className={styles.legend}><span>✦ Collect</span><span>! Danger</span><span>↕ Highlighted = interactive</span></small>
                <small>3 levels · Checkpoints along the way</small>
              </div>
            )}
            {mode === 'paused' && (
              <div className={styles.overlay}>
                <p>ADVENTURE PAUSED</p>
                <h3>Ready when you are.</h3>
                <button type="button" onClick={resume}>Keep Going <span aria-hidden="true">→</span></button>
              </div>
            )}

          </div>

          {(mode === 'won' || mode === 'map') && <div className={styles.journeyPanel} aria-live="polite">
            {mode === 'won' && lastResult ? <>
              <p className={styles.kicker}>{level.name} · COMPLETE</p>
              <h3>{levelId === 2 && complete ? 'Adventure Complete!' : 'You made it!'}</h3>
              <p><strong lang="th">ยินดีต้อนรับพัทลุง!</strong><br/>Welcome to Phatthalung!</p>
              <dl className={styles.results}>
                <div><dt>Mangoes</dt><dd>{lastResult.mangoes}/{lastResult.total}</dd></div>
                <div><dt>Secrets</dt><dd>{lastResult.secrets}/{lastResult.secretTotal}</dd></div>
                <div><dt>Time</dt><dd>{Math.floor(lastResult.seconds / 60)}:{String(Math.floor(lastResult.seconds % 60)).padStart(2, '0')}</dd></div>
                <div><dt>Golden Mango</dt><dd>{adventure.some(r => r?.gold) ? 'FOUND!' : '???'}</dd></div>
              </dl>
              {complete && <p className={styles.adventureTotal}>Across the adventure: {totalMangoes}/{totalPossible} mangoes · {earnedStamps.length}/{STAMPS.length} stamps</p>}
              <div className={styles.stamps}>{lastResult.stamps.map(stamp => <span key={stamp}>✦ {stamp}</span>)}</div>
              <div className={styles.resultActions}>
                <button type="button" onClick={() => setMode('map')}>{levelId < 2 ? 'Continue to Journey Map →' : 'Explore the Journey Map'}</button>
                <button type="button" onClick={() => begin(levelId)}>Replay this level</button>
              </div>
            </> : <>
              <p className={styles.kicker}>YOUR LITTLE JOURNEY</p>
              <h3>Three roads. One adventure.</h3>
              <p>Choose your next stop—or revisit a favorite.</p>
              <div className={styles.mapGrid}>
                {LEVELS.map((stop, index) => <button type="button" key={stop.id} disabled={!isUnlocked(adventure, index)} onClick={() => begin(index)} className={styles.mapStop}>
                  <img src={'/game/route-' + index + '.jpg'} alt="" width="512" height="180"/>
                  <span className={styles.stopNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{stop.name}</strong><small>{stop.subtitle}</small>
                  <b>{adventure[index] ? 'Completed · Play again ↺' : isUnlocked(adventure, index) ? 'Your next adventure →' : 'Complete the previous stop to unlock'}</b>
                </button>)}
              </div>
              <p className={styles.stampTitle}>YOUR JOURNEY STAMPS · {earnedStamps.length}/{STAMPS.length}</p>
              <div className={styles.stamps}>{STAMPS.map(stamp => <span key={stamp} data-earned={earnedStamps.includes(stamp)}>{earnedStamps.includes(stamp) ? '✦' : '◇'} {stamp}</span>)}</div>
              <small>Progress stays with you while this page is open. Replay to collect the stamps you missed.</small>
            </>}
          </div>}

          <div className={styles.controls} aria-label="Game controls">
            <div className={styles.moveControls}>
              <button type="button" disabled={mode !== 'playing'} onPointerDown={event => pressControl('left', event)} onPointerUp={event => releaseControl('left', event)} onPointerCancel={event => releaseControl('left', event)} onLostPointerCapture={event => releaseControl('left', event)} aria-label="Move left"><span aria-hidden="true">←</span><small>LEFT</small></button>
              <button type="button" disabled={mode !== 'playing'} onPointerDown={event => pressControl('right', event)} onPointerUp={event => releaseControl('right', event)} onPointerCancel={event => releaseControl('right', event)} onLostPointerCapture={event => releaseControl('right', event)} aria-label="Move right"><span aria-hidden="true">→</span><small>RIGHT</small></button>
            </div>
            <p><strong>Keyboard</strong><span>← → or A D to move · Space, ↑, or W to jump</span></p>
            <button type="button" className={styles.jumpButton} disabled={mode !== 'playing'} onPointerDown={event => pressControl('jump', event)} onPointerUp={event => releaseControl('jump', event)} onPointerCancel={event => releaseControl('jump', event)} onLostPointerCapture={event => releaseControl('jump', event)} aria-label="Jump"><span aria-hidden="true">↑</span><small>JUMP</small></button>
          </div>
        </div>

        <div className={styles.gameNotes}>
          <p><span>01</span><strong>Collect mangoes</strong><small>A few are tucked away above the obvious road.</small></p>
          <p><span>02</span><strong>Bit of local food staples</strong><small>Durian: charge. Cha Yen: fly. Sticky rice: double jump. Mala: fireballs. Discover more treats along the way.</small></p>
          <p><span>03</span><strong>Stop for moo ping</strong><small>A roadside treat restores a heart—or earns a small bonus.</small></p>
          <p><span>04</span><strong>Enjoy the journey</strong><small>Earn little journey stamps, explore three routes, and meet the friends waiting at the end.</small></p>
        </div>
        <details className={styles.foodGuide}>
          <summary>Meet the local power-ups</summary>
          <div>{(Object.keys(POWER_META) as PowerKind[]).map(kind => <p key={kind}>
            <img src={'/game/' + POWER_ART[kind] + '.png'} width="56" height="64" alt=""/>
            <strong>{POWER_META[kind].label}</strong><small>{POWER_META[kind].instruction}</small>
          </p>)}</div>
          <p>One special power at a time. Mangoes, Golden Mangoes, and Moo Ping never replace your power. Red “!” markers mean danger; calm animals and background traffic are safe.</p>
        </details>

        <span className={styles.srOnly} data-game-status data-level={levelId} data-stamps={earnedStamps.join(',')} data-x={Math.round(hud.x)} data-y={Math.round(hud.y)} data-health={lives} data-power={hud.power} data-checkpoint={hud.checkpoint} data-mode={mode} aria-live="polite">{[`Mangoes ${mangoCount}`, `Hearts ${lives}`, `Journey ${progress} percent`, hud.power, hud.message].filter(Boolean).join('. ')}.</span>
      </div>
    </section>
  );
}
