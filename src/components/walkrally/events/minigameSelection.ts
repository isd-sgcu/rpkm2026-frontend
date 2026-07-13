const STORAGE_KEY = "walkrally-selected-minigame";

export function getStoredMinigameId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem(STORAGE_KEY) ?? undefined;
}

export function setStoredMinigameId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, id);
}

export function clearStoredMinigameId() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
