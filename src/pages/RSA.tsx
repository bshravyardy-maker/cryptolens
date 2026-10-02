import { DepthStack, Scene } from '../components/crypto/Scenes3D.tsx';
import { useStepper } from '../hooks/useStepper.ts';
import { useMemo, useState } from 'react';
import { modPowSteps, rsaDecrypt, rsaEncrypt, rsaKeys } from '../crypto/rsa.ts';
import { Controls, Err, Field, Page, Warn, msg, parseBig } from '../components/common/ui.tsx';
export default function RSA() {
  const [v, setV] = useState({ p: '61', q: '53', e: '17', m: '65' });
  const set = (k: keyof typeof v) => (x: string) => setV({ ...v, [k]: x });
  const r = useMemo(() => { try {
    const keys = rsaKeys(parseBig('p', v.p), parseBig('q', v.q), parseBig('e', v.e));
    const m = parseBig('Message', v.m); const c = rsaEncrypt(m, keys.e, keys.n);
    return { keys, m, c, back: rsaDecrypt(c, keys.d, keys.n), trace: modPowSteps(m, keys.e, keys.n), err: null as string | null };
  } catch (e) { return { err: msg(e) }; } }, [v]);
  const s = useStepper(r.trace?.length ?? 1);
  return (<Page crumb="RSA" title="RSA" intro="Textbook RSA with small numbers. The message is a single integer smaller than n; real RSA adds padding and uses primes hundreds of digits long.">
    <Warn>These parameters are intentionally small for learning. They are not suitable for protecting real-world data.</Warn>
    <div className="panel grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Field id="r-p" label="p (prime)" value={v.p} onChange={set('p')} /><Field id="r-q" label="q (prime)" value={v.q} onChange={set('q')} />
      <Field id="r-e" label="e" value={v.e} onChange={set('e')} /><Field id="r-m" label="Message (integer < n)" value={v.m} onChange={set('m')} />
      <button className="btn self-end" onClick={() => setV({ p: '61', q: '53', e: '17', m: '65' })}>Reset</button></div>
    <Err msg={'err' in r && r.err ? r.err : null} />
    {'keys' in r && r.keys && (<><section className="panel" aria-labelledby="k-h"><h2 id="k-h" className="font-semibold">Keys</h2>
      <dl className="mt-2 grid gap-1 font-mono text-sm sm:grid-cols-2"><dt>n = p × q</dt><dd>{String(r.keys.n)}</dd><dt>φ(n) = (p−1)(q−1)</dt><dd>{String(r.keys.phi)}</dd><dt>d = e⁻¹ mod φ(n)</dt><dd>{String(r.keys.d)}</dd>
        <dt>Public key (e, n)</dt><dd>({String(r.keys.e)}, {String(r.keys.n)})</dd><dt>Private key (d, n)</dt><dd>({String(r.keys.d)}, {String(r.keys.n)})</dd></dl></section>
      <Scene title="Square-and-multiply in 3D" height={200} rx={35} tilt0={0} caption="Each card is one exponent bit. The active step is in front; remaining steps recede."><DepthStack active={s.i} onSelect={s.set} items={r.trace.map((t, i) => ({ title: `Step ${i + 1} · exponent bit ${t.bit}`, body: `running result mod n = ${t.result}` }))} /></Scene>
      <Controls s={s} />
      <section className="panel" aria-labelledby="e-h"><h2 id="e-h" className="font-semibold">Encrypt and decrypt</h2>
        <p className="mt-2 font-mono text-sm">c = m^e mod n = {String(r.m)}^{String(r.keys.e)} mod {String(r.keys.n)} = {String(r.c)}</p>
        <p className="font-mono text-sm">m = c^d mod n = {String(r.c)}^{String(r.keys.d)} mod {String(r.keys.n)} = {String(r.back)}</p>
        <h3 className="mt-4 text-sm font-semibold">Square-and-multiply trace for the encryption</h3><p className="text-xs text-mute">One row per bit of e, most significant first: square, then multiply by m if the bit is 1.</p>
        <div className="mt-2 overflow-x-auto"><table className="font-mono text-sm"><thead><tr><th className="pr-4 text-left">Step</th><th className="pr-4 text-left">Bit</th><th className="text-left">Running result mod n</th></tr></thead>
          <tbody>{r.trace.map((t, i) => <tr key={i} className="border-t border-line"><td className="pr-4">{i + 1}</td><td className="pr-4">{t.bit}</td><td>{String(t.result)}</td></tr>)}</tbody></table></div></section></>)}
  </Page>);
}
