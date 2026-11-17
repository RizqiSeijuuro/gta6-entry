// Police: wanted level rises on crime and decays over time; cops spawn near the player and chase.
import { CITY_W, CITY_H } from './city.js';

export function makeWantedState() { return { level: 0, heat: 0 }; }

export function addCrime(state, amount) {
  state.heat = Math.min(500, state.heat + amount);
  state.level = Math.min(5, Math.floor(state.heat / 100));
}

export function decayWanted(state, dt) {
  if (state.heat > 0) state.heat = Math.max(0, state.heat - dt * 6);
  state.level = Math.min(5, Math.floor(state.heat / 100));
}

export function spawnCop(playerX, playerY) {
  const angle = Math.random() * Math.PI * 2;
  const dist = 260 + Math.random() * 80;
  return {
    x: Math.max(10, Math.min(CITY_W - 10, playerX + Math.cos(angle) * dist)),
    y: Math.max(10, Math.min(CITY_H - 10, playerY + Math.sin(angle) * dist)),
    angle: 0,
    speed: 0,
  };
}

export function updateCop(cop, dt, targetX, targetY) {
  const SPEED = 150, TURN = 3;
  const desired = Math.atan2(targetY - cop.y, targetX - cop.x);
  let diff = desired - cop.angle;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  cop.angle += Math.sign(diff) * Math.min(Math.abs(diff), TURN * dt);
  cop.x += Math.cos(cop.angle) * SPEED * dt;
  cop.y += Math.sin(cop.angle) * SPEED * dt;
}

export function drawCop(ctx, cop, camX, camY) {
  ctx.save();
  ctx.translate(cop.x - camX, cop.y - camY);
  ctx.rotate(cop.angle);
  ctx.fillStyle = '#2255ff';
  ctx.fillRect(-14, -8, 28, 16);
  ctx.fillStyle = '#fff';
  ctx.fillRect(-3, -8, 6, 16);
  ctx.restore();
}
