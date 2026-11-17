// The player: on-foot movement, health, shooting, and entering/leaving cars.
import { CITY_W, CITY_H } from './city.js';

export function makePlayer() {
  return { x: CITY_W / 2, y: CITY_H / 2, angle: 0, health: 100, inCar: null, cash: 0 };
}

export function updatePlayerOnFoot(player, dt, dx, dy) {
  const SPEED = 140;
  if (dx || dy) {
    const len = Math.hypot(dx, dy) || 1;
    player.x += (dx / len) * SPEED * dt;
    player.y += (dy / len) * SPEED * dt;
    player.angle = Math.atan2(dy, dx);
  }
  player.x = Math.max(8, Math.min(CITY_W - 8, player.x));
  player.y = Math.max(8, Math.min(CITY_H - 8, player.y));
}

export function drawPlayer(ctx, player, camX, camY) {
  if (player.inCar) return;
  ctx.save();
  ctx.translate(player.x - camX, player.y - camY);
  ctx.rotate(player.angle);
  ctx.fillStyle = '#ffd54a';
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#222';
  ctx.fillRect(4, -2, 10, 4);
  ctx.restore();
}

export function fireShot(player, targets, onHit) {
  const RANGE = 140;
  for (const t of targets) {
    if (!t.alive && t.alive !== undefined) continue;
    const dx = t.x - player.x, dy = t.y - player.y;
    const dist = Math.hypot(dx, dy);
    if (dist > RANGE) continue;
    const angleTo = Math.atan2(dy, dx);
    let diff = Math.abs(angleTo - player.angle);
    if (diff > Math.PI) diff = Math.PI * 2 - diff;
    if (diff < 0.5) { onHit(t); return true; }
  }
  return false;
}
