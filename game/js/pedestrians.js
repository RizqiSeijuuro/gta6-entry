// Wandering pedestrians: idle civilians who scatter when the player is wanted and nearby.
import { CITY_W, CITY_H } from './city.js';

export function spawnPeds(n) {
  const peds = [];
  for (let i = 0; i < n; i++) {
    peds.push({
      x: 40 + Math.random() * (CITY_W - 80),
      y: 40 + Math.random() * (CITY_H - 80),
      dir: Math.random() * Math.PI * 2,
      timer: Math.random() * 3,
      alive: true,
      color: ['#f1c40f', '#1abc9c', '#e67e22', '#9b59b6'][i % 4],
    });
  }
  return peds;
}

export function updatePed(p, dt, playerX, playerY, wanted) {
  if (!p.alive) return;
  p.timer -= dt;
  const scared = wanted > 0 && Math.hypot(p.x - playerX, p.y - playerY) < 120;
  if (scared) p.dir = Math.atan2(p.y - playerY, p.x - playerX);
  else if (p.timer <= 0) { p.dir = Math.random() * Math.PI * 2; p.timer = 1 + Math.random() * 3; }
  const speed = scared ? 90 : 30;
  p.x += Math.cos(p.dir) * speed * dt;
  p.y += Math.sin(p.dir) * speed * dt;
  p.x = Math.max(10, Math.min(CITY_W - 10, p.x));
  p.y = Math.max(10, Math.min(CITY_H - 10, p.y));
}

export function drawPed(ctx, p, camX, camY) {
  if (!p.alive) return;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.arc(p.x - camX, p.y - camY, 6, 0, Math.PI * 2);
  ctx.fill();
}
