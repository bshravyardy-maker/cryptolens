import { useCallback, useState } from 'react';
export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('cryptolens-theme', next ? 'dark' : 'light'); } catch { /* storage unavailable: preference lasts for this visit only */ }
    setDark(next);
  }, []);
  return { dark, toggle };
}
