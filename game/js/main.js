// Sunline City: the main loop. Wires the city, player, cars, pedestrians, police, missions and HUD.
import { CITY_W, CITY_H, buildings, roads, districts } from './city.js';
import { initInput, isDown, anyDown, consumeOnce } from './input.js';
import { spawnCars, updateCar, drawCar } from './car.js';
import { spawnPeds, updatePed, drawPed } from './pedestrians.js';
import { makePlayer, updatePlayerOnFoot, drawPlayer, fireShot } from './player.js';
import { makeWantedState, addCrime, decayWanted, spawnCop, updateCop, drawCop } from './police.js';
import { makeMissionState, missionLabel, checkMissionProgress, missionTarget } from './missions.js';
import { renderHud, drawMinimap } from './hud.js';
import { saveGame, loadGame } from './save.js';

const worldCanvas = document.getElementById('world');
const ctx = worldCanvas.getContext('2d');
const miniCanvas = document.getElementById('minimap');
const miniCtx = miniCanvas.getContext('2d');

const player = makePlayer();
const wanted = makeWantedState();
const missionState = makeMissionState();
const cars = spawnCars(14);
const peds = spawnPeds(30);
const cops = [];

loadGame(player, missionState);
initInput();

let last = performance.now();
let saveTimer = 0;

document.getElementById('playBtn').addEventListener('click', () => {
  document.getElementById('start').classList.add('hidden');
  requestAnimationFrame(loop);
});

function nearestFreeCar() {
  let best = null, bestD = 36;
  for (const c of cars) {
    if (c.occupied) continue;
    const d = Math.hypot(c.x - player.x, c.y - player.y);
    if (d < bestD) { bestD = d; best = c; }
  }
  return best;
}

function handleEnterExit() {
  if (!consumeOnce('e')) return;
  if (player.inCar) {
    player.inCar.occupied = false;
    player.x = player.inCar.x; player.y = player.inCar.y;
    player.inCar = null;
  } else {
    const c = nearestFreeCar();
    if (c) { c.occupied = true; player.inCar = c; }
  }
}

function update(dt) {
  decayWanted(wanted, dt);
  handleEnterExit();

  if (player.inCar) {
    const forward = (anyDown('w', 'arrowup') ? 1 : 0) - (anyDown('s', 'arrowdown') ? 1 : 0);
    const turn = (anyDown('d', 'arrowright') ? 1 : 0) - (anyDown('a', 'arrowleft') ? 1 : 0);
    updateCar(player.inCar, dt, forward, turn);
    player.x = player.inCar.x; player.y = player.inCar.y; player.angle = player.inCar.angle;
    for (const p of peds) {
      if (p.alive && Math.hypot(p.x - player.x, p.y - player.y) < 14 && Math.abs(player.inCar.speed) > 60) {
        p.alive = false; addCrime(wanted, 60);
      }
    }
  } else {
    let dx = 0, dy = 0;
    if (anyDown('w', 'arrowup')) dy -= 1;
    if (anyDown('s', 'arrowdown')) dy += 1;
    if (anyDown('a', 'arrowleft')) dx -= 1;
    if (anyDown('d', 'arrowright')) dx += 1;
    updatePlayerOnFoot(player, dt, dx, dy);
    if (consumeOnce(' ')) {
      const hit = fireShot(player, peds, (t) => { t.alive = false; addCrime(wanted, 40); });
      if (!hit) fireShot(player, cops, () => addCrime(wanted, 80));
    }
  }

  for (const c of cars) if (!c.occupied) updateCar(c, dt, 0, 0);
  for (const p of peds) updatePed(p, dt, player.x, player.y, wanted.level);

  if (wanted.level > 0 && cops.length < wanted.level * 2 && Math.random() < dt * 0.6) cops.push(spawnCop(player.x, player.y));
  for (const c of cops) {
    updateCop(c, dt, player.x, player.y);
    if (Math.hypot(c.x - player.x, c.y - player.y) < 20) {
      player.health -= 10 * dt;
      if (wanted.level > 0 && Math.hypot(c.x - player.x, c.y - player.y) < 16) wanted.heat = Math.max(0, wanted.heat - 30 * dt);
    }
  }
  if (player.health <= 0) { player.health = 100; player.x = CITY_W / 2; player.y = CITY_H / 2; wanted.heat = 0; }

  const reward = checkMissionProgress(missionState, player.x, player.y);
  if (reward) player.cash += reward;

  saveTimer += dt;
  if (saveTimer > 2) { saveTimer = 0; saveGame(player, missionState); }
}

function drawWorld() {
  const camX = Math.max(0, Math.min(CITY_W - worldCanvas.width, player.x - worldCanvas.width / 2));
  const camY = Math.max(0, Math.min(CITY_H - worldCanvas.height, player.y - worldCanvas.height / 2));

  ctx.fillStyle = '#273144';
  ctx.fillRect(0, 0, worldCanvas.width, worldCanvas.height);
  ctx.fillStyle = '#3d4455';
  for (const r of roads) ctx.fillRect(r.x - camX, r.y - camY, r.w, r.h);
  for (const b of buildings) { ctx.fillStyle = b.color; ctx.fillRect(b.x - camX, b.y - camY, b.w, b.h); }

  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#ffffffaa';
  for (const d of districts) ctx.fillText(d.name, d.x - camX - 30, d.y - camY);

  for (const c of cars) if (!c.occupied) drawCar(ctx, c, camX, camY);
  for (const p of peds) drawPed(ctx, p, camX, camY);
  for (const c of cops) drawCop(ctx, c, camX, camY);
  drawPlayer(ctx, player, camX, camY);
  if (player.inCar) drawCar(ctx, player.inCar, camX, camY);

  const target = missionTarget(missionState);
  if (target) {
    const angle = Math.atan2(target.y - player.y, target.x - player.x);
    ctx.save();
    ctx.translate(worldCanvas.width / 2, worldCanvas.height / 2);
    ctx.rotate(angle);
    ctx.fillStyle = '#ff5050';
    ctx.beginPath();
    ctx.moveTo(60, 0); ctx.lineTo(44, -8); ctx.lineTo(44, 8);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
}

function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  update(dt);
  drawWorld();
  renderHud(player, wanted, missionLabel(missionState));
  drawMinimap(miniCtx, player, cops, missionTarget(missionState));
  requestAnimationFrame(loop);
}
