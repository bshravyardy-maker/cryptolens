import { useState } from 'react';
import MissionShell from '../../components/learning/MissionShell.tsx';
import { caesar } from '../../crypto/classical.ts';
const PLAIN = 'HELLO', SECRET = 3, CT = caesar(PLAIN, SECRET);
function Body({ onDone }: { onDone: () => void }) {
  const [shift, setShift] = useState(0); const [found, setFound] = useState(false); const [ans, setAns] = useState(''); const [fb, setFb] = useState<string | null>(null);
  const cand = caesar(CT, shift, true); const target = caesar('CAT', 5);
  const check = () => { if (ans.trim().toUpperCase() === target) { setFb(null); onDone(); } else setFb(!ans.trim() ? 'Type your answer first: move each letter of CAT five places forward.' : `${ans.trim().toUpperCase()} is not right. Move C five places (C→D→E→F→G→H), then do the same for A and T.`); };
  return (<>
    <section className="panel" aria-labelledby="c1"><h2 id="c1" className="font-semibold">Eve intercepted: <span className="font-mono text-accent">{CT}</span></h2>
      <label className="label mt-3" htmlFor="sh">Shift: {shift}</label>
      <input id="sh" type="range" min={0} max={25} value={shift} className="w-full accent-[var(--accent)]" onChange={(e) => { const s = Number(e.target.value); setShift(s); if (caesar(CT, s, true) === PLAIN) setFound(true); }} />
      <p className="mt-2 font-mono text-lg" aria-live="polite">{CT} → {cand}</p></section>
    {found && (<>
      <section className="panel" aria-live="polite"><p><strong>Found it.</strong> Each letter was shifted three positions through the alphabet.</p>
        <p className="mt-2 font-mono text-sm">{['A', 'B', 'C'].map((l) => `${l} → ${caesar(l, 3)}`).join('   ')}</p>
        <p className="mt-2 text-sm">Technically: <span className="font-mono">C = (P + K) mod 26</span> where P is the letter's position (A = 0), K is the shift and C is the new position.</p></section>
      <section className="panel" aria-labelledby="c2"><h2 id="c2" className="font-semibold">Second challenge: encrypt CAT using shift 5</h2>
        <label className="label mt-2" htmlFor="ans">Your ciphertext</label><input id="ans" className="field max-w-xs" value={ans} onChange={(e) => setAns(e.target.value)} />
        <button className="btn-p mt-2" onClick={check}>Check</button>{fb && <p role="alert" className="mt-2 text-sm text-bad">{fb}</p>}</section></>)}</>);
}
export default function CaesarMission() { return <MissionShell id="caesar" intro="Each letter moves a fixed number of places through the alphabet. Find how far." summary="You discovered that a Caesar cipher shifts each letter by a fixed amount, and that only 26 shifts exist, so it is easy to break by trying them all.">{(d) => <Body onDone={d} />}</MissionShell>; }
