import { LayerRows3D, Scene } from '../components/crypto/Scenes3D.tsx';
import { useMemo, useState } from 'react';
import { vigenere } from '../crypto/classical.ts';
import { Controls, Err, Field, Page, msg } from '../components/common/ui.tsx';
import { useStepper } from '../hooks/useStepper.ts';
export default function Vigenere() {
  const [text, setText] = useState('ATTACK AT DAWN'); const [key, setKey] = useState('LEMON'); const [dec, setDec] = useState(false);
  const r = useMemo(() => {
    try { if (!text) throw new Error('Enter some text first.'); return { out: vigenere(text, key, dec), err: null as string | null }; }
    catch (e) { return { out: '', err: msg(e) }; }
  }, [text, key, dec]);
  const k = key.toUpperCase().replace(/[^A-Z]/g, '');
  const rows = useMemo(() => { let n = 0; const res: { p: string; k: string; pn: number; kn: number; o: string }[] = [];
    if (!r.err) text.split('').forEach((ch, i) => { if (/[a-z]/i.test(ch)) { const kl = k[n++ % k.length]; res.push({ p: ch, k: kl, pn: ch.toUpperCase().charCodeAt(0) - 65, kn: kl.charCodeAt(0) - 65, o: r.out[i] }); } });
    return res; }, [text, k, r]);
  const s = useStepper(Math.max(rows.length, 1)); const cur = rows[s.i];
  return (<Page crumb="Vigenère" title="Vigenère Cipher" intro="A repeating keyword picks the Caesar shift for each letter. Only letters consume key characters; spaces and punctuation pass through and do not advance the key.">
    <div className="grid gap-4 md:grid-cols-2"><div className="panel space-y-3"><Field id="v-text" label="Text" value={text} onChange={setText} />
      <Field id="v-key" label="Key" value={key} onChange={setKey} hint="Letters A-Z only; other characters in the key are ignored." />
      <div className="flex gap-2"><button className={dec ? 'btn' : 'btn-p'} aria-pressed={!dec} onClick={() => setDec(false)}>Encrypt</button><button className={dec ? 'btn-p' : 'btn'} aria-pressed={dec} onClick={() => setDec(true)}>Decrypt</button>
        <button className="btn" onClick={() => { setText('ATTACK AT DAWN'); setKey('LEMON'); setDec(false); s.reset(); }}>Reset</button></div></div>
      <div className="panel"><p className="label">Output</p><Err msg={r.err} />{!r.err && <p className="break-all font-mono text-lg" aria-live="polite">{r.out}</p>}</div></div>
    {!r.err && rows.length > 0 && cur && <Scene title="Vigenère layers in 3D" height={230} rx={50} tilt0={-10} caption="Front to back: input letters, repeated key, result. The current column lifts through all three layers."><LayerRows3D active={s.i} rows={[{ label: 'in', cells: rows.map((x) => x.p) }, { label: 'key', cells: rows.map((x) => x.k) }, { label: 'out', cells: rows.map((x) => x.o) }]} /></Scene>}
    {!r.err && rows.length > 0 && cur && (<section className="panel" aria-labelledby="vs-h"><h2 id="vs-h" className="font-semibold">Letter by letter</h2>
      <div className="mt-3 overflow-x-auto"><table className="font-mono text-sm"><tbody>
        <tr><th scope="row" className="pr-3 text-left text-mute">{dec ? 'Cipher' : 'Plain'}</th>{rows.map((x, i) => <td key={i} className={`px-1 text-center ${i === s.i ? 'border border-accent' : ''}`}>{x.p}</td>)}</tr>
        <tr><th scope="row" className="pr-3 text-left text-mute">Key</th>{rows.map((x, i) => <td key={i} className={`px-1 text-center ${i === s.i ? 'border border-accent' : ''}`}>{x.k}</td>)}</tr>
        <tr><th scope="row" className="pr-3 text-left text-mute">Result</th>{rows.map((x, i) => <td key={i} className={`px-1 text-center text-accent ${i === s.i ? 'border border-accent' : ''}`}>{x.o}</td>)}</tr></tbody></table></div>
      <p className="mt-3 font-mono text-sm" aria-live="polite">{dec ? `P = (C − K) mod 26 = (${cur.pn} − ${cur.kn}) mod 26 = ${((cur.pn - cur.kn + 26) % 26)}` : `C = (P + K) mod 26 = (${cur.pn} + ${cur.kn}) mod 26 = ${(cur.pn + cur.kn) % 26}`} → {cur.o}</p>
      <div className="mt-3"><Controls s={s} /></div></section>)}
  </Page>);
}
