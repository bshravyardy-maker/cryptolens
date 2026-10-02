import { useMemo, useState } from 'react';
import { aesEncryptSteps, bytesToHex, hexToBytes } from '../crypto/aes.ts';
import { Controls, Err, Field, Hex, Page, Warn, msg } from '../components/common/ui.tsx';
import StateView from '../components/crypto/StateView.tsx';
import { useStepper } from '../hooks/useStepper.ts';
const KEY = '2b7e151628aed2a6abf7158809cf4f3c', BLOCK = '3243f6a8885a308d313198a2e0370734';
export default function AES() {
  const [key, setKey] = useState(KEY); const [block, setBlock] = useState(BLOCK);
  const r = useMemo(() => { try {
    const k = hexToBytes(key), b = hexToBytes(block);
    if (![16, 24, 32].includes(k.length)) throw new Error(`Key is ${k.length} bytes; AES needs 16, 24 or 32 bytes (32, 48 or 64 hex digits).`);
    if (b.length !== 16) throw new Error(`Block is ${b.length} bytes; AES encrypts exactly 16 bytes (32 hex digits).`);
    return { steps: aesEncryptSteps(b, k), err: null as string | null };
  } catch (e) { return { steps: [], err: msg(e) }; } }, [key, block]);
  const s = useStepper(Math.max(r.steps.length, 1)); const cur = r.steps[s.i]; const prev = s.i > 0 ? r.steps[s.i - 1] : undefined;
  const rounds = r.steps.length ? r.steps[r.steps.length - 1].round : 0;
  return (<Page crumb="AES" title="AES" intro="Single-block AES encryption (FIPS-197). Every matrix below is the state returned by the tested AES implementation, shown column-major as in the standard.">
    <Warn>Educational visualization of one block, no mode of operation. Do not use it to protect real data.</Warn>
    <div className="panel grid gap-3 md:grid-cols-2"><Field id="a-key" label="Key (hex)" value={key} onChange={setKey} hint="32, 48 or 64 hex digits for AES-128, 192 or 256." />
      <Field id="a-blk" label="Block (hex)" value={block} onChange={setBlock} hint="Exactly 32 hex digits." />
      <button className="btn self-start" onClick={() => { setKey(KEY); setBlock(BLOCK); s.reset(); }}>Reset to FIPS-197 Appendix B example</button></div>
    <Err msg={r.err} />
    {cur && (<div className="grid gap-4 md:grid-cols-[1fr_2fr]">
      <section className="panel" aria-labelledby="st-h"><h2 id="st-h" className="font-semibold">Stages</h2>
        <label className="label mt-2" htmlFor="rnd">Jump to round</label>
        <select id="rnd" className="field" value={cur.round} onChange={(e) => s.set(r.steps.findIndex((x) => x.round === Number(e.target.value) && x.op !== 'Input'))}>{Array.from({ length: rounds + 1 }, (_, i) => <option key={i} value={i}>Round {i}</option>)}</select>
        <ol className="mt-3 max-h-72 overflow-y-auto text-sm">{r.steps.map((x, i) => (<li key={i}><button className={`w-full border-l-2 px-2 py-1 text-left ${i === s.i ? 'border-accent font-semibold' : 'border-line text-mute'}`} aria-current={i === s.i ? 'step' : undefined} onClick={() => s.set(i)}>R{x.round} · {x.op}</button></li>))}</ol></section>
      <section className="panel" aria-labelledby="cs-h"><h2 id="cs-h" className="font-semibold">Round {cur.round} · {cur.op}</h2>
        <div className="mt-3"><StateView state={cur.state} prev={prev?.state} /></div>
        <p className="mt-2 text-sm">State as hex: <Hex>{bytesToHex(cur.state)}</Hex></p>
        {s.i === r.steps.length - 1 && <p className="mt-2 text-sm">Ciphertext: <Hex>{bytesToHex(cur.state)}</Hex></p>}
        <div className="mt-4"><Controls s={s} /></div></section></div>)}
  </Page>);
}
