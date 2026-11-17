// HUD: wanted stars, cash, mission text, health bar, and the minimap render.
import { CITY_W, CITY_H, buildings, districts } from './city.js';

export function renderHud(player, wanted, missionText) {
  document.getElementById('wanted').textContent = '★'.repeat(wanted.level) || '·';
  document.getElementById('cash').textContent = `$${player.cash}`;
  document.getElementById('mission').textContent = missionText;
  document.getElementById('healthBar').style.width = `${Math.max(0, player.health)}%`;
}

export function drawMinimap(ctx, player, cops, mission) {
  ctx.clearRect(0, 0, 160, 160);
  ctx.fillStyle = '#10131a';
  ctx.fillRect(0, 0, 160, 160);
  const sx = 160 / CITY_W, sy = 160 / CITY_H;
  ctx.fillStyle = '#2b3140';
  for (const b of buildings) ctx.fillRect(b.x * sx, b.y * sy, Math.max(1, b.w * sx), Math.max(1, b.h * sy));
  ctx.fillStyle = '#ffd54a';
  ctx.beginPath();
  ctx.arc(player.x * sx, player.y * sy, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2255ff';
  for (const c of cops) { ctx.beginPath(); ctx.arc(c.x * sx, c.y * sy, 2, 0, Math.PI * 2); ctx.fill(); }
  if (mission) {
    ctx.fillStyle = '#ff5050';
    ctx.beginPath();
    ctx.arc(mission.x * sx, mission.y * sy, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#555';
  ctx.strokeRect(0, 0, 160, 160);
}
