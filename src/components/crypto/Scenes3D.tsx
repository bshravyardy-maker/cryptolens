import { useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Shared 3D stage (CSS 3D transforms, no WebGL). Rotatable; can be hidden; disabled under reduced motion. */
export function Scene({ title, caption, height = 260, rx = 55, tilt0 = -20, children }: { title: string; caption?: string; height?: number; rx?: number; tilt0?: number; children: ReactNode }) {
  const reduced = useReducedMotion(); const [off, setOff] = useState(false); const [tilt, setTilt] = useState(tilt0);
  if (reduced || off) return (<div className="flex flex-wrap items-center gap-3 border border-line px-3 py-2 text-xs text-mute"><span>{title}: 3D view {reduced ? 'is off because reduced motion is on' : 'is hidden'}. The 2D details show the same values.</span>{!reduced && <button className="btn" onClick={() => setOff(false)}>Show 3D</button>}</div>);
  return (<section className="panel" aria-label={title}>
    <div className="mb-2 flex flex-wrap items-center gap-3"><h3 className="text-sm font-semibold">{title}</h3>
      <button className="btn" onClick={() => setOff(true)}>Hide 3D</button>
      <label className="flex items-center gap-2 text-xs text-mute">Rotate<input type="range" min={-60} max={60} value={tilt} onChange={(e) => setTilt(Number(e.target.value))} aria-label={`Rotate ${title}`} /></label></div>
    <div style={{ perspective: 900, height, overflowX: 'auto', overflowY: 'hidden' }} role="group" aria-label={`${title} (decorative 3D rendering; values are repeated in text elsewhere on the page)`}>
      <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto', paddingTop: 36, transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateZ(${tilt}deg)`, transition: 'transform 0.3s' }}>{children}</div></div>
    {caption && <p className="mt-1 text-xs text-mute">{caption}</p>}</section>);
}

/** Caesar: plain alphabet in front, shifted alphabet behind; the selected letter lifts on both layers. */
export function AlphabetStrips3D({ shift, index }: { shift: number; index: number }) {
  const strip = (f: (i: number) => string, z: number, cls: string) => (
    <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateZ(${z}px)`, transformStyle: 'preserve-3d' }} className="flex">
      {ABC.split('').map((_, i) => (<div key={i} style={{ width: 20, height: 26, transform: i === index ? 'translateZ(18px)' : undefined, transition: 'transform 0.3s' }}
        className={`flex items-center justify-center border bg-panel font-mono text-xs ${i === index ? 'border-accent' : 'border-line'} ${cls}`}>{f(i)}</div>))}</div>);
  return <div style={{ position: 'relative', width: 520, height: 26, transformStyle: 'preserve-3d' }}>{strip((i) => ABC[i], 0, '')}{strip((i) => ABC[(i + shift) % 26], -60, 'text-accent')}</div>;
}

/** Vigenère (or any row-aligned data): one plane per row, the active column lifts through all planes. */
export function LayerRows3D({ rows, active }: { rows: { label: string; cells: string[] }[]; active: number }) {
  const n = rows[0]?.cells.length ?? 0;
  return (<div style={{ position: 'relative', width: n * 26, height: 28, transformStyle: 'preserve-3d' }}>
    {rows.map((r, ri) => (<div key={r.label} style={{ position: 'absolute', left: 0, top: 0, transform: `translateZ(${-ri * 55}px)`, transformStyle: 'preserve-3d' }} className="flex">
      {r.cells.map((c, i) => (<motion.div key={i} animate={{ z: i === active ? 20 : 0 }} style={{ width: 24, height: 28, marginRight: 2, transformStyle: 'preserve-3d' }}
        className={`flex items-center justify-center border bg-panel font-mono text-xs ${i === active ? 'border-accent' : 'border-line'} ${ri === rows.length - 1 ? 'text-accent' : ''}`}>{c}</motion.div>))}</div>))}</div>);
}

/** Stages stacked in depth: the active stage is in front, upcoming stages recede, finished stages lift away. Cards are buttons. */
export function DepthStack({ items, active, onSelect }: { items: { title: string; body: string }[]; active: number; onSelect: (i: number) => void }) {
  return (<div style={{ position: 'relative', width: 280, height: 70, transformStyle: 'preserve-3d' }}>
    {items.map((it, i) => { const d = i - active; if (d > 4) return null;
      return (<motion.button key={i} onClick={() => onSelect(i)} aria-current={d === 0 ? 'step' : undefined} tabIndex={d < 0 ? -1 : 0}
        animate={{ z: d < 0 ? 70 : d === 0 ? 30 : -d * 45, y: d < 0 ? -34 : d * 10, opacity: d < 0 ? 0 : 1 - d * 0.18 }} transition={{ duration: 0.4 }}
        style={{ position: 'absolute', inset: 0, pointerEvents: d < 0 ? 'none' : 'auto' }}
        className={`border bg-panel p-2 text-left font-mono text-xs ${d === 0 ? 'border-accent' : 'border-line text-mute'}`}>
        <span className="block font-semibold">{it.title}</span><span className="block break-all">{it.body.slice(0, 60)}</span></motion.button>); })}</div>);
}

/** Diffie-Hellman: Alice and Bob face each other; public values travel across at different depths. */
export function AliceBob3D({ A, B, aliceSecret, bobSecret }: { A: string; B: string; aliceSecret: string; bobSecret: string }) {
  const card = (name: string, pub: string, sec: string, x: number, ry: number) => (
    <div style={{ position: 'absolute', top: 0, left: x, width: 150, height: 96, transform: `rotateY(${ry}deg)` }} className="border border-line bg-panel p-2 font-mono text-xs">
      <p className="font-semibold">{name}</p><p>public: {pub}</p><p>secret: {sec}</p></div>);
  const block = (key: string, label: string, from: number, to: number, z: number, top: number) => (
    <motion.div key={key} initial={{ x: from, z, opacity: 0 }} animate={{ x: to, z, opacity: 1 }} transition={{ duration: 1.2 }}
      style={{ position: 'absolute', top, left: 0 }} className="border border-accent bg-panel px-1 font-mono text-xs text-accent">{label}</motion.div>);
  return (<div style={{ position: 'relative', width: 460, height: 96, transformStyle: 'preserve-3d' }}>
    {card('Alice', A, aliceSecret, 0, 25)}{card('Bob', B, bobSecret, 310, -25)}
    {block('a' + A, `A=${A}`, 150, 290, 30, 20)}{block('b' + B, `B=${B}`, 290, 150, -30, 56)}</div>);
}

const bitsOf = (hex: string) => hex.split('').map((c) => parseInt(c, 16).toString(2).padStart(4, '0')).join('');
/** SHA-256: both 256-bit digests as 16×16 bit planes; differing bits lift and are filled. */
export function BitPlanes3D({ h1, h2 }: { h1: string; h2: string }) {
  const b1 = bitsOf(h1), b2 = bitsOf(h2);
  const plane = (bits: string, other: string, z: number) => (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 207, height: 207, transform: `translateZ(${z}px)`, transformStyle: 'preserve-3d', display: 'grid', gridTemplateColumns: 'repeat(16, 12px)', gap: 1 }}>
      {bits.split('').map((b, i) => { const diff = b !== other[i];
        return <div key={i} style={{ height: 12, transform: diff ? 'translateZ(14px)' : undefined, transition: 'transform 0.3s' }} className={`border ${diff ? 'border-accent bg-accent' : b === '1' ? 'border-line bg-line' : 'border-line'}`} />; })}</div>);
  return (<div style={{ position: 'relative', width: 207, height: 207, transformStyle: 'preserve-3d' }}>{plane(b1, b2, 0)}{plane(b2, b1, -70)}</div>);
}

/** Frequency analysis: ciphertext frequencies in front, English reference frequencies behind. */
export function FreqPlanes3D({ rows, reference, max }: { rows: { letter: string; share: number }[]; reference: number[]; max: number }) {
  const H = 130;
  const plane = (vals: number[], z: number, cls: string) => (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 364, height: H, transform: `translateZ(${z}px)` }} className="flex items-end gap-px">
      {vals.map((v, i) => <div key={i} style={{ width: 13, height: Math.max(1, (v / max) * H) }} className={cls} />)}</div>);
  return (<div style={{ position: 'relative', width: 364, height: H, transformStyle: 'preserve-3d' }}>
    {plane(reference, -60, 'bg-line')}{plane(rows.map((x) => x.share * 100), 0, 'bg-accent')}
    <div style={{ position: 'absolute', left: 0, top: H + 2, width: 364 }} className="flex font-mono text-xs text-mute">{rows.map((x) => <span key={x.letter} style={{ width: 14 }} className="text-center">{x.letter}</span>)}</div></div>);
}
