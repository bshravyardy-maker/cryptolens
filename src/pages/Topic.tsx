import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Err, Field, Hex, msg } from '../components/common/ui.tsx';
import { byId, type Line, type Topic as T, type Values } from '../topics/topics.ts';
import { NotFound } from './Static.tsx';

const NONE: T = { id: '', title: '', category: '', blurb: '', tint: 0, tall: false, glyph: () => ['', ''], how: [], exampleNote: '', fields: [], run: () => [], limits: '', related: [] };
const NO_VALUES: Values = {};
function useRun(t: T, v: Values) {
  const [res, setRes] = useState<{ lines: Line[]; err: string | null }>({ lines: [], err: null });
  useEffect(() => { let live = true; Promise.resolve().then(() => t.run(v)).then((lines) => live && setRes({ lines, err: null })).catch((e) => live && setRes({ lines: [], err: msg(e) })); return () => { live = false; }; }, [t, v]);
  return res;
}
const defaults = (t: T): Values => Object.fromEntries(t.fields.map((f) => [f.id, f.def]));
function Output({ res }: { res: { lines: Line[]; err: string | null } }) {
  return (<div aria-live="polite"><Err msg={res.err} />{!res.err && <dl className="space-y-2">{res.lines.map((l, i) => (<motion.div key={l.label + i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 8) * 0.04 }}><dt className="label !mb-0">{l.label}</dt><dd><Hex>{l.value}</Hex></dd></motion.div>))}</dl>}</div>);
}
export default function TopicPage() {
  const { id = '' } = useParams(); const t = byId(id);
  const [v, setV] = useState<Values>(() => (t ? defaults(t) : {}));
  useEffect(() => { const n = byId(id); if (n) setV(defaults(n)); window.scrollTo(0, 0); }, [id]);
  const base = t ?? NONE; const defs = useMemo(() => (t ? defaults(t) : NO_VALUES), [t]);
  const ex = useRun(base, defs); const play = useRun(base, v);
  if (!t) return <NotFound />;
  const rel = t.related.map(byId).filter((x): x is T => x !== undefined);
  return (<main id="main">
    <div style={{ background: `var(--t${t.tint})` }}><div className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/" className="text-sm underline">← All topics</Link><p className="label mt-4">{t.category}</p>
      <h1 className="font-display text-4xl font-semibold">{t.title}</h1><p className="mt-2 max-w-2xl text-lg">{t.blurb}</p></div></div>
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-10">
      <section aria-labelledby="how"><h2 id="how" className="font-display text-2xl font-semibold">How it works</h2>
        <ol className="mt-4 space-y-3">{t.how.map((s, i) => (<motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex gap-3"><span className="font-mono text-accent">{i + 1}</span><span>{s}</span></motion.li>))}</ol></section>
      <section aria-labelledby="ex" className="rounded-lg border border-line bg-panel p-5"><h2 id="ex" className="font-display text-2xl font-semibold">A worked example</h2><p className="mt-1 text-sm text-mute">{t.exampleNote}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">{t.fields.map((f) => <p key={f.id} className="text-sm"><span className="label !mb-0">{f.label}</span><Hex>{f.def}</Hex></p>)}</div><div className="mt-4 border-t border-line pt-4"><Output res={ex} /></div></section>
      <section aria-labelledby="pg" className="rounded-lg border border-accent bg-panel p-5"><h2 id="pg" className="font-display text-2xl font-semibold">Playground</h2><p className="mt-1 text-sm text-mute">Change anything. The result updates as you type, using the same code as the unit tests.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">{t.fields.map((f) => <Field key={f.id} id={`f-${f.id}`} label={f.label} value={v[f.id] ?? ''} hint={f.hint} onChange={(x) => setV({ ...v, [f.id]: x })} />)}</div>
        <button className="btn mt-3" onClick={() => setV(defaults(t))}>Reset to the example</button><div className="mt-4 max-h-96 overflow-auto border-t border-line pt-4"><Output res={play} /></div></section>
      <section aria-labelledby="lim"><h2 id="lim" className="font-display text-2xl font-semibold">Limits</h2><p className="mt-2">{t.limits}</p><p className="mt-2 text-sm text-mute">Educational demo: do not use it to protect real secrets.</p></section>
      <div className="flex flex-wrap gap-2">{t.full && <Link className="btn-p" to={t.full.to}>{t.full.label}</Link>}{rel.map((r) => <Link key={r.id} className="btn" to={`/topic/${r.id}`}>Next: {r.title}</Link>)}</div>
    </div></main>);
}
