// Save/load progress to localStorage: cash and mission index.
const KEY = 'sunline-city-save-v1';

export function saveGame(player, missionState) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ cash: player.cash, missionIndex: missionState.index }));
  } catch { /* storage unavailable: play on without saving */ }
}

export function loadGame(player, missionState) {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.cash === 'number') player.cash = data.cash;
    if (typeof data.missionIndex === 'number') missionState.index = data.missionIndex;
  } catch { /* corrupt or missing save: start fresh */ }
}
