import { useMemo, useState } from 'react';
import MissionShell from '../../components/learning/MissionShell.tsx';
import { Warn } from '../../components/common/ui.tsx';
import { caesar, caesarBruteForce, letterFrequencies } from '../../crypto/classical.ts';
const PLAIN = 'MEET ME AT THE BRIDGE AT NOON', CT = caesar(PLAIN, 11);
function Body({ onDone }: { onDone: () => void }) {
  const [shift, setShift] = useState(0); const cand = caesar(CT, shift, true);
  const top = useMemo(() => [...letterFrequencies(CT)].sort((a, b) => b.count - a.count).slice(0, 3), []);
  return (<>
    <section className="panel"><h2 className="font-semibold">Intercepted: <span className="font-mono text-accent">{CT}</span></h2>
      <label className="label mt-3" htmlFor="cs">Try shift: {shift}</label>
      <input id="cs" type="range" min={0} max={25} value={shift} className="w-full accent-[var(--accent)]" onChange={(e) => { const s = Number(e.target.value); setShift(s); if (caesar(CT, s, true) === PLAIN) onDone(); }} />
      <p className="mt-2 break-all font-mono" aria-live="polite">{cand}</p></section>
    <section className="panel"><h2 className="font-semibold">Look for structure</h2>
      <p className="mt-1 text-sm">Most common letters in the ciphertext (counted): {top.map((t) => `${t.letter} ×${t.count}`).join(', ')}. In English the most common letter is usually E, so a frequent ciphertext letter hints at the shift.</p>
      <details className="mt-3 text-sm"><summary className="cursor-pointer">Brute force: all 26 candidates</summary><ul className="mt-2 max-h-56 overflow-auto font-mono">{caesarBruteForce(CT).map((c) => <li key={c.shift}>shift {c.shift}: {c.text}</li>)}</ul></details></section>
    <Warn>Frequency analysis works on simple substitution ciphers with enough text. It does not break modern ciphers such as AES.</Warn></>);
}
export default function CryptanalysisMission() { return <MissionShell id="cryptanalysis" intro="An attacker sees only ciphertext. Find the structure that gives the key away." summary="You broke a Caesar message by exploiting structure: only 26 shifts exist and letter frequencies leak information. Cryptanalysis looks for exactly this kind of structure.">{(d) => <Body onDone={d} />}</MissionShell>; }
