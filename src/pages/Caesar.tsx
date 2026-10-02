import { AlphabetStrips3D, Scene } from '../components/crypto/Scenes3D.tsx';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { caesar, caesarBruteForce } from '../crypto/classical.ts';
import { Err, Field, Page, msg } from '../components/common/ui.tsx';
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export default function Caesar() {
  const [text, setText] = useState('Hello, World!'); const [shift, setShift] = useState('3');
  const [dec, setDec] = useState(false); const [sel, setSel] = useState(0);
  const r = useMemo(() => {
    try {
      if (!text) throw new Error('Enter some text first.');
      if (!/^-?\d+$/.test(shift.trim())) throw new Error('Shift must be a whole number such as 3 or -5.');
      const n = Number(shift); return { n, out: caesar(text, n, dec), err: null as string | null };
    } catch (e) { return { n: 0, out: '', err: msg(e) }; }
  }, [text, shift, dec]);
  const eff = ((((dec ? -r.n : r.n) % 26) + 26) % 26);
  const chars = text.split('').slice(0, 48);
  const c = chars[Math.min(sel, chars.length - 1)] ?? '';
  const isL = /[a-z]/i.test(c);
  return (<Page crumb="Caesar" title="Caesar Cipher" intro="Each letter moves a fixed number of places along the alphabet. Case is preserved; spaces, digits, punctuation and non-Latin characters pass through unchanged.">
    <div className="grid gap-4 md:grid-cols-2">
      <div className="panel space-y-3"><Field id="c-text" label="Text" value={text} onChange={setText} />
        <Field id="c-shift" label="Shift" value={shift} onChange={setShift} hint="Any whole number; it is reduced modulo 26." />
        <div className="flex gap-2"><button className={dec ? 'btn' : 'btn-p'} aria-pressed={!dec} onClick={() => setDec(false)}>Encrypt</button>
          <button className={dec ? 'btn-p' : 'btn'} aria-pressed={dec} onClick={() => setDec(true)}>Decrypt</button>
          <button className="btn" onClick={() => { setText('Hello, World!'); setShift('3'); setDec(false); setSel(0); }}>Reset</button></div></div>
      <div className="panel"><p className="label">Output</p><Err msg={r.err} />{!r.err && <p className="break-all font-mono text-lg" aria-live="polite">{r.out}</p>}</div></div>
    {!r.err && <Scene title="Alphabet layers in 3D" height={200} rx={50} tilt0={-10} caption="Front: plain alphabet. Back: alphabet shifted by the current shift. The selected character lifts on both layers."><AlphabetStrips3D shift={eff} index={isL ? ABC.indexOf(c.toUpperCase()) : -1} /></Scene>}
    {!r.err && (<section className="panel" aria-labelledby="map-h"><h2 id="map-h" className="font-semibold">Character mapping</h2>
      <p className="text-sm text-mute">Select a character to inspect it. Output letters come from the Caesar implementation.</p>
      <div className="mt-3 flex flex-wrap gap-1">{chars.map((ch, i) => (<button key={i} onClick={() => setSel(i)} aria-pressed={sel === i} aria-label={`Character ${i + 1}: ${ch === ' ' ? 'space' : ch}`}
        className={`w-9 border text-center font-mono text-sm ${sel === i ? 'border-accent' : 'border-line'}`}><div className="py-1">{ch === ' ' ? '␣' : ch}</div><motion.div key={r.out[i] + eff} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-line py-1 text-accent">{r.out[i] === ' ' ? '␣' : r.out[i]}</motion.div></button>))}</div>
      <p className="mt-3 font-mono text-sm">{isL ? `${c} → position ${ABC.indexOf(c.toUpperCase())} ${dec ? '−' : '+'} ${Math.abs(r.n) % 26 === 0 ? 0 : (((r.n % 26) + 26) % 26)} (mod 26) → ${r.out[sel]}` : `"${c}" is not a Latin letter, so it is copied unchanged.`}</p>
      <div className="mt-3 overflow-x-auto"><div className="font-mono text-xs" aria-label="Alphabet and shifted alphabet"><div className="flex">{ABC.split('').map((l) => <span key={l} className="w-6 shrink-0 text-center">{l}</span>)}</div>
        <div className="flex text-accent">{ABC.split('').map((_, i) => <span key={i} className="w-6 shrink-0 text-center">{ABC[(i + eff) % 26]}</span>)}</div></div></div></section>)}
    <section className="panel" aria-labelledby="bf-h"><h2 id="bf-h" className="font-semibold">Brute force: all 26 shifts</h2>
      <p className="text-sm text-mute">Treats the text above as ciphertext and decrypts it with every possible shift.</p>
      <div className="mt-3 overflow-x-auto"><table className="w-full text-left font-mono text-sm"><thead><tr><th className="pr-4">Shift</th><th>Candidate plaintext</th></tr></thead>
        <tbody>{text ? caesarBruteForce(text).map((b) => <tr key={b.shift} className="border-t border-line"><td className="pr-4">{b.shift}</td><td className="break-all">{b.text}</td></tr>) : <tr><td colSpan={2}>Enter text to see candidates.</td></tr>}</tbody></table></div></section>
  </Page>);
}
