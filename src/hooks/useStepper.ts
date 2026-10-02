import { useEffect, useState } from 'react';
export function useStepper(len: number, intervalMs = 900) {
  const [raw, setRaw] = useState(0);
  const [playing, setPlaying] = useState(false);
  const i = Math.max(0, Math.min(raw, len - 1));
  useEffect(() => {
    if (!playing) return;
    if (i >= len - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setRaw(i + 1), intervalMs);
    return () => clearTimeout(t);
  }, [playing, i, len, intervalMs]);
  return {
    i, len, playing,
    set: (n: number) => setRaw(Math.max(0, Math.min(n, len - 1))),
    next: () => setRaw(Math.min(i + 1, len - 1)), prev: () => setRaw(Math.max(i - 1, 0)),
    toggle: () => { if (i >= len - 1) setRaw(0); setPlaying((p) => !p); },
    reset: () => { setPlaying(false); setRaw(0); },
  };
}
export type Stepper = ReturnType<typeof useStepper>;
