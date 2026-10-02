import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Stepper } from '../../hooks/useStepper.ts';

export function Page({ title, intro, children, crumb }: { title: string; intro?: string; children: ReactNode; crumb?: string }) {
  return (
    <main id="main" className="mx-auto w-full max-w-6xl px-4 py-8">
      {crumb && <nav aria-label="Breadcrumb" className="mb-2 text-xs text-mute"><Link className="underline" to="/algorithms">Algorithms</Link> / <span aria-current="page">{crumb}</span></nav>}
      <h1 className="text-2xl font-semibold">{title}</h1>
      {intro && <p className="mt-2 max-w-3xl text-mute">{intro}</p>}
      <div className="mt-6 space-y-6">{children}</div>
    </main>
  );
}
export const Warn = ({ children }: { children: ReactNode }) => <p className="border-l-2 border-accent bg-panel px-3 py-2 text-sm">{children}</p>;
export const Err = ({ msg }: { msg: string | null }) => msg ? <p role="alert" className="border border-bad px-3 py-2 text-sm text-bad"><strong>Error:</strong> {msg}</p> : null;
export function Field({ label, value, onChange, id, hint }: { label: string; value: string; onChange: (v: string) => void; id: string; hint?: string }) {
  return (<div><label className="label" htmlFor={id}>{label}</label>
    <input id={id} className="field" value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={hint ? id + '-h' : undefined} spellCheck={false} />
    {hint && <p id={id + '-h'} className="mt-1 text-xs text-mute">{hint}</p>}</div>);
}
export const Hex = ({ children }: { children: ReactNode }) => <code className="break-all font-mono text-sm">{children}</code>;
export function Controls({ s }: { s: Stepper }) {
  return (<div className="flex flex-wrap items-center gap-2" role="group" aria-label="Step controls">
    <button className="btn" onClick={s.prev} disabled={s.i === 0}>Previous</button>
    <button className="btn-p" onClick={s.toggle} aria-pressed={s.playing}>{s.playing ? 'Pause' : 'Play'}</button>
    <button className="btn" onClick={s.next} disabled={s.i >= s.len - 1}>Next</button>
    <button className="btn" onClick={s.reset}>Reset</button>
    <span className="font-mono text-sm text-mute" aria-live="polite">step {s.i + 1} / {s.len}</span></div>);
}
/** 4x4 AES state; input is column-major (index = row + 4*col). Changed bytes get a border and a "Δ" mark. */
export function Matrix({ state, prev }: { state: number[]; prev?: number[] }) {
  return (<div className="grid w-full max-w-xs grid-cols-4 gap-1" role="table" aria-label="AES state matrix">
    {[0, 1, 2, 3].flatMap((r) => [0, 1, 2, 3].map((c) => {
      const v = state[r + 4 * c]; const changed = prev !== undefined && prev[r + 4 * c] !== v;
      return (<div key={`${r}${c}`} role="cell" className={`border px-1 py-2 text-center font-mono text-sm ${changed ? 'border-accent text-accent' : 'border-line'}`}>
        {v.toString(16).padStart(2, '0')}{changed && <span aria-label="changed" className="ml-0.5 text-xs">Δ</span>}</div>);
    }))}</div>);
}
export const parseBig = (label: string, s: string): bigint => {
  if (!/^\d+$/.test(s.trim())) throw new Error(`${label} must be a non-negative whole number.`);
  return BigInt(s.trim());
};
export const msg = (e: unknown) => (e instanceof Error ? e.message : 'Input could not be processed.');
