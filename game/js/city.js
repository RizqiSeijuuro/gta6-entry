// The city: a grid of blocks, roads and buildings for Sunline City, plus a few named districts.
export const CITY_W = 2400;
export const CITY_H = 1800;
const BLOCK = 240;

export const buildings = [];
export const roads = [];
export const districts = [
  { name: 'Marina Heights', x: 200, y: 200, color: '#2a6f97' },
  { name: 'Old Pier', x: 1900, y: 300, color: '#b5651d' },
  { name: 'Sunline Downtown', x: 1100, y: 900, color: '#6a4c93' },
  { name: 'Rust Quarter', x: 400, y: 1500, color: '#4a4e4d' },
];

for (let gx = 0; gx < CITY_W / BLOCK; gx++) {
  for (let gy = 0; gy < CITY_H / BLOCK; gy++) {
    const x = gx * BLOCK + 20, y = gy * BLOCK + 20, w = BLOCK - 40, h = BLOCK - 40;
    const hue = 190 + ((gx * 7 + gy * 13) % 80);
    const height = 20 + ((gx * 31 + gy * 17) % 60);
    buildings.push({ x, y, w, h, color: `hsl(${hue} 30% ${22 + (height % 20)}%)`, height });
  }
}
for (let gx = 0; gx <= CITY_W / BLOCK; gx++) roads.push({ x: gx * BLOCK - 10, y: 0, w: 20, h: CITY_H, vertical: true });
for (let gy = 0; gy <= CITY_H / BLOCK; gy++) roads.push({ x: 0, y: gy * BLOCK - 10, w: CITY_W, h: 20, vertical: false });

export function isOnRoad(x, y) {
  for (const r of roads) if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return true;
  return false;
}

export function districtNear(x, y) {
  let best = null, bestD = Infinity;
  for (const d of districts) {
    const dist = Math.hypot(d.x - x, d.y - y);
    if (dist < bestD) { bestD = dist; best = d.name; }
  }
  return best;
}
