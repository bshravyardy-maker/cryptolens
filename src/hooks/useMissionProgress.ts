import { useCallback, useState } from 'react';
import { completeMission, getStore, loadProgress, saveProgress, type Progress } from '../learning/progress.ts';
import type { MissionId } from '../learning/missions.ts';
export function useMissionProgress() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress(getStore()));
  const finish = useCallback((id: MissionId) => setProgress((p) => { const n = completeMission(p, id); if (n !== p) saveProgress(getStore(), n); return n; }), []);
  const reset = useCallback(() => { setProgress({}); saveProgress(getStore(), {}); }, []);
  return { progress, finish, reset };
}
