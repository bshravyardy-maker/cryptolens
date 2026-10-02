import { MISSIONS, type MissionId } from './missions.ts';
export type Progress = Partial<Record<MissionId, true>>;
export interface Store { getItem(k: string): string | null; setItem(k: string, v: string): void }
export const PROGRESS_KEY = 'cryptolens-progress';

export function getStore(): Store | null {
  try { return typeof window !== 'undefined' ? window.localStorage : null; } catch { return null; }
}
/** Reads progress; anything missing, corrupted or unavailable yields an empty (session-only) state. */
export function loadProgress(store: Store | null): Progress {
  try {
    const raw = store?.getItem(PROGRESS_KEY);
    if (!raw) return {};
    const data: unknown = JSON.parse(raw);
    if (typeof data !== 'object' || data === null) return {};
    const out: Progress = {};
    for (const m of MISSIONS) if ((data as Record<string, unknown>)[m.id] === true) out[m.id] = true;
    return out;
  } catch { return {}; }
}
export function saveProgress(store: Store | null, p: Progress): boolean {
  try { if (!store) return false; store.setItem(PROGRESS_KEY, JSON.stringify(p)); return true; } catch { return false; }
}
export const completeMission = (p: Progress, id: MissionId): Progress => (p[id] ? p : { ...p, [id]: true });
export const nextMission = (p: Progress) => MISSIONS.find((m) => !p[m.id]);
export const isCorrect = (picked: number | null, correct: number) => picked === correct;
