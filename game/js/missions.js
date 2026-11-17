// The story: a short chain of missions across Sunline City's districts.
import { districtNear } from './city.js';

const CHAIN = [
  { id: 'intro', text: 'Marcus wants a word. Drive to Old Pier.', x: 1900, y: 300, reward: 50 },
  { id: 'pickup', text: 'Grab the package from Rust Quarter and keep it clean.', x: 400, y: 1500, reward: 120 },
  { id: 'deliver', text: 'Deliver it to Sunline Downtown before the heat finds you.', x: 1100, y: 900, reward: 220 },
  { id: 'heist', text: 'One last job: hit the vault in Marina Heights.', x: 200, y: 200, reward: 500 },
];

export function makeMissionState() { return { index: 0, done: false }; }

export function currentMission(state) {
  if (state.index >= CHAIN.length) return null;
  return CHAIN[state.index];
}

export function missionLabel(state) {
  const m = currentMission(state);
  if (!m) return 'No active contracts. You made it out of Sunline City.';
  return `${districtNear(m.x, m.y)}: ${m.text}`;
}

export function checkMissionProgress(state, playerX, playerY) {
  const m = currentMission(state);
  if (!m) return 0;
  if (Math.hypot(playerX - m.x, playerY - m.y) < 70) {
    state.index += 1;
    return m.reward;
  }
  return 0;
}

export function missionTarget(state) {
  return currentMission(state);
}
