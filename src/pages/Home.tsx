import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { caesar } from '../crypto/classical.ts';
import { TOPICS, type Topic } from '../topics/topics.ts';

/** Types out topic names one letter at a time. Static text for reduced motion and screen readers. */
function Typed({ words }: { words: string[] }) {
  const reduced = useReducedMotion(); const [i, setI] = useState(0); const [n, setN] = useState(0); const [del, setDel] = useState(false);
  useEffect(() => {
    if (reduced) return; const w = words[i]; const full = !del && n === w.length;
    const t = setTimeout(() => { if (full) setDel(true); else if (!del) setN(n + 1); else if (n > 0) setN(n - 1); else { setDel(false); setI((i + 1) % words.length); } }, full ? 1300 : del ? 35 : 80);
    return () => clearTimeout(t);
  }, [reduced, words, i, n, del]);
  return (<><span className="sr-only">{words.join(', ')}</span><span aria-hidden="true" className="text-accent">{reduced ? words[0] : words[i].slice(0, n)}<span className="caret">|</span></span></>);
}
function Glyph({ topic }: { topic: Topic }) {
  const [a, b] = topic.glyph(); const [on, setOn] = useState(false); const reduced = useReducedMotion();
  useEffect(() => { if (reduced) return; const t = setInterval(() => setOn((x) => !x), 2400); return () => clearInterval(t); }, [reduced]);
  return (<div className="flex min-h-[4.5rem] items-center overflow-hidden rounded-md border border-line bg-panel px-3 font-mono text-sm" aria-label={`Example: ${a} becomes ${b}`}>
    <AnimatePresence mode="wait" initial={false}><motion.span key={String(on)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="break-all">{on ? <><span className="text-mute">→ </span><span className="text-accent">{b}</span></> : a}</motion.span></AnimatePresence></div>);
}
function Card({ t, i }: { t: Topic; i: number }) {
  return (<motion.li className="h-full" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: (i % 3) * 0.08, duration: 0.45 }} whileHover={{ y: -6 }}>
    <Link to={`/topic/${t.id}`} className="flex h-full flex-col rounded-lg border border-line p-5 shadow-sm transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent" style={{ background: `var(--t${t.tint})` }}>
      <p className="label">{t.category}</p><h3 className="font-display text-xl font-semibold">{t.title}</h3><p className="mb-4 mt-1 text-sm">{t.blurb}</p>
      <div className="mt-auto"><Glyph topic={t} /><p className="mt-3 text-sm font-semibold">Open topic →</p></div></Link></motion.li>);
}
function HeroDemo() {
  const reduced = useReducedMotion(); const [text, setText] = useState('CRYPTO'); const [shift, setShift] = useState(3); const [auto, setAuto] = useState(true); const out = caesar(text, shift);
  useEffect(() => { if (!auto || reduced) return; const t = setInterval(() => setShift((s) => (s + 1) % 26), 1500); return () => clearInterval(t); }, [auto, reduced]);
  return (<div className="rounded-lg border border-line bg-panel p-5 shadow-sm"><label className="label" htmlFor="hero-text">Type a word</label>
    <input id="hero-text" className="field" value={text} maxLength={14} onChange={(e) => setText(e.target.value)} /><label className="label mt-3" htmlFor="hero-shift">Shift: {shift}</label>
    <input id="hero-shift" type="range" min={0} max={25} value={shift} onChange={(e) => { setAuto(false); setShift(Number(e.target.value)); }} className="w-full accent-[var(--accent)]" />
    <div className="mt-3 flex flex-wrap gap-1" aria-live="off">{text.split('').map((c, i) => (<motion.div key={i + c + shift} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-8 rounded-sm border border-line text-center font-mono text-sm"><div className="py-1">{c}</div><div className="border-t border-line py-1 text-accent">{out[i]}</div></motion.div>))}</div>
    {auto && !reduced && <button className="btn mt-3" onClick={() => setAuto(false)}>Stop animation</button>}</div>);
}
const grid = 'mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3';
export default function Home() {
  const main = TOPICS.filter((t) => t.category !== 'Attack Lab'), atk = TOPICS.filter((t) => t.category === 'Attack Lab');
  return (<main id="main">
    <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-[1.3fr_1fr]">
      <div><h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">See what happens inside a cryptographic algorithm.</h1>
        <p className="mt-4 font-mono text-lg">Explore: <Typed words={TOPICS.map((t) => t.title)} /></p>
        <p className="mt-3 max-w-xl text-mute">Pick a topic, read how it works, then play with it. Every result comes from tested code.</p>
        <div className="mt-6 flex flex-wrap gap-2"><a className="btn-p" href="#topics">Browse the topics</a><Link className="btn" to="/learn">Guided missions</Link></div></div><HeroDemo /></section>
    <section id="topics" className="mx-auto max-w-6xl px-4 pb-12" aria-labelledby="t-h"><h2 id="t-h" className="font-display text-2xl font-semibold">Pick a topic</h2>
      <ul className={grid}>{main.map((t, i) => <Card key={t.id} t={t} i={i} />)}</ul></section>
    <section className="mx-auto max-w-6xl px-4 pb-12" aria-labelledby="atk-h"><h2 id="atk-h" className="font-display text-2xl font-semibold">Attack Lab: break weak cryptography</h2>
      <p className="mt-1 max-w-2xl text-mute">Four attacks on deliberately weak setups. Each shows how real systems fail.</p>
      <ul className={grid}>{atk.map((t, i) => <Card key={t.id} t={t} i={i} />)}</ul></section>
  </main>);
}
