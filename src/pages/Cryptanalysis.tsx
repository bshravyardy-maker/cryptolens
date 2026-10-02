import { DepthStack, FreqPlanes3D, Scene } from '../components/crypto/Scenes3D.tsx';
import { useMemo, useState } from 'react';
import { caesarBruteForce, letterFrequencies } from '../crypto/classical.ts';
import { Err, Field, Page, Warn, msg } from '../components/common/ui.tsx';
// Approximate English letter frequencies in percent (A-Z), a commonly cited reference table.
const EN = [8.2, 1.5, 2.8, 4.3, 12.7, 2.2, 2.0, 6.1, 7.0, 0.15, 0.8, 4.0, 2.4, 6.7, 7.5, 1.9, 0.1, 6.0, 6.3, 9.1, 2.8, 1.0, 2.4, 0.15, 2.0, 0.07];
export default function Cryptanalysis() {
  const [ct, setCt] = useState('WKLV LV D FDHVDU FLSKHU PHVVDJH'); const [sel, setSel] = useState(3);
  const cands = useMemo(() => caesarBruteForce(ct), [ct]);
  const f = useMemo(() => { try { return { rows: letterFrequencies(ct), err: null as string | null }; } catch (e) { return { rows: [], err: msg(e) }; } }, [ct]);
  const max = Math.max(...f.rows.map((x) => x.share * 100), ...EN);
  return (<Page crumb="Cryptanalysis" title="Cryptanalysis" intro="Two classic attacks on classical ciphers: trying every Caesar shift, and comparing letter frequencies.">
    <div className="panel"><Field id="x-ct" label="Ciphertext" value={ct} onChange={setCt} /></div>
    <section className="panel" aria-labelledby="bf"><h2 id="bf" className="font-semibold">Caesar brute force</h2>
      <div className="mt-3"><Scene title="Candidates in 3D" height={170} rx={35} tilt0={0} caption="The selected shift is in front. Click a card to inspect it."><DepthStack active={sel} onSelect={setSel} items={cands.map((c) => ({ title: `shift ${c.shift}`, body: c.text }))} /></Scene></div>
      <div className="mt-3 grid gap-4 md:grid-cols-[2fr_1fr]"><div className="max-h-80 overflow-auto"><table className="w-full text-left font-mono text-sm"><tbody>{cands.map((c) => (<tr key={c.shift} className={`border-t border-line ${sel === c.shift ? 'bg-bg' : ''}`}><td className="pr-3"><button className="underline" onClick={() => setSel(c.shift)} aria-pressed={sel === c.shift}>shift {c.shift}</button></td><td className="break-all">{c.text}</td></tr>))}</tbody></table></div>
        <div className="border border-line p-3"><p className="label">Inspecting shift {sel}</p><p className="break-all font-mono text-sm">{cands[sel]?.text}</p><p className="mt-2 text-xs text-mute">Decrypting with shift {sel} means moving each letter back {sel} places.</p></div></div></section>
    <section className="panel" aria-labelledby="fq"><h2 id="fq" className="font-semibold">Frequency analysis</h2><Err msg={f.err} />
      {!f.err && (<><div className="mt-3"><Scene title="Frequencies in 3D" height={230} rx={15} tilt0={-30} caption="Front: letter shares in your ciphertext. Back: approximate English reference."><FreqPlanes3D rows={f.rows} reference={EN} max={max} /></Scene></div><div className="mt-3 overflow-x-auto"><div className="flex h-40 min-w-[26rem] items-end gap-1" role="img" aria-label="Bar chart of letter frequencies in the ciphertext, with English reference markers">{f.rows.map((x, i) => (<div key={x.letter} className="relative flex flex-1 flex-col items-center justify-end" style={{ height: '100%' }} title={`${x.letter}: ${x.count} (${(x.share * 100).toFixed(1)}%), English reference ${EN[i]}%`}>
        <div className="w-full bg-accent" style={{ height: `${(x.share * 100 / max) * 100}%` }} /><div className="absolute w-full border-t-2 border-fg" style={{ bottom: `${(EN[i] / max) * 100}%` }} /></div>))}</div>
        <div className="flex min-w-[26rem] gap-1 font-mono text-xs">{f.rows.map((x) => <span key={x.letter} className="flex-1 text-center">{x.letter}</span>)}</div></div>
        <p className="mt-2 text-xs text-mute">Bars: letter share in your ciphertext (counted from the text). Lines: approximate English reference frequencies. Hover a bar for exact counts.</p></>)}
      <Warn>Frequency analysis works on simple substitution ciphers with enough text. Short messages give unreliable counts, and it is not a way to break modern ciphers such as AES.</Warn></section>
  </Page>);
}
