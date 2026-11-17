// Keyboard input state for the player and the car.
const keys = new Set();
export function initInput() {
  window.addEventListener('keydown', (e) => keys.add(e.key.toLowerCase()));
  window.addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
}
export function isDown(key) { return keys.has(key); }
export function anyDown(...list) { return list.some((k) => keys.has(k)); }
export function consumeOnce(key) {
  if (keys.has(key)) { keys.delete(key); return true; }
  return false;
}
