import { useMemo, useState } from 'react';
import MissionShell from '../../components/learning/MissionShell.tsx';
import { Err, Field, Warn, msg, parseBig } from '../../components/common/ui.tsx';
import { rsaDecrypt, rsaEncrypt, rsaKeys } from '../../crypto/rsa.ts';
function Body({ onDone }: { onDone: () => void }) {
  const [v, setV] = useState({ p: '61', q: '53', e: '17', m: '65' }); const [stage, setStage] = useState<'keys' | 'locked' | 'unlocked'>('keys');
  const set = (k: keyof typeof v) => (x: string) => { setV({ ...v, [k]: x }); setStage('keys'); };
  const r = useMemo(() => { try { const k = rsaKeys(parseBig('p', v.p), parseBig('q', v.q), parseBig('e', v.e)); const m = parseBig('Message', v.m); const c = rsaEncrypt(m, k.e, k.n); return { k, m, c, back: rsaDecrypt(c, k.d, k.n), err: null as string | null }; } catch (e) { return { err: msg(e) }; } }, [v]);
  return (<>
    <Warn>These numbers are intentionally small for learning. They are not suitable for protecting real-world data.</Warn>
    <section className="panel grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Field id="rp" label="Prime p" value={v.p} onChange={set('p')} /><Field id="rq" label="Prime q" value={v.q} onChange={set('q')} /><Field id="re" label="e" value={v.e} onChange={set('e')} /><Field id="rm" label="Number to lock (< n)" value={v.m} onChange={set('m')} /></section>
    <Err msg={r.err} />
    {'k' in r && r.k && (<>
      <section className="panel" aria-labelledby="rk"><h2 id="rk" className="font-semibold">Building the lock</h2>
        <p className="mt-2 font-mono text-sm">n = p × q = {String(r.k.p)} × {String(r.k.q)} = {String(r.k.n)}</p><p className="font-mono text-sm">φ(n) = (p − 1)(q − 1) = {String(r.k.phi)}</p><p className="font-mono text-sm">d = e⁻¹ mod φ(n) = {String(r.k.d)}</p>
        <p className="mt-2 text-sm"><strong>Public key (the lock anyone can use):</strong> (e, n) = ({String(r.k.e)}, {String(r.k.n)})<br /><strong>Private key (only Bob keeps it):</strong> (d, n) = ({String(r.k.d)}, {String(r.k.n)})</p></section>
      <section className="panel" aria-live="polite"><h2 className="font-semibold">Lock and unlock</h2>
        <div className="mt-2 flex flex-wrap gap-2"><button className="btn-p" onClick={() => setStage('locked')}>Lock {String(r.m)} with the public key</button><button className="btn-p" disabled={stage === 'keys'} onClick={() => { setStage('unlocked'); if (r.back === r.m) onDone(); }}>Can Bob unlock it?</button></div>
        {stage !== 'keys' && <p className="mt-2 font-mono text-sm">c = m^e mod n = {String(r.m)}^{String(r.k.e)} mod {String(r.k.n)} = {String(r.c)}</p>}
        {stage === 'unlocked' && <p className="mt-1 font-mono text-sm">m = c^d mod n = {String(r.c)}^{String(r.k.d)} mod {String(r.k.n)} = {String(r.back)} {r.back === r.m ? '✓ matches the original' : '✗ does not match'}</p>}</section></>)}</>);
}
export default function RsaMission() { return <MissionShell id="rsa" intro="Build a key pair from two primes, lock a number with the public key, and unlock it with the private key." summary="You built an RSA key pair from two primes, locked a number with the public key and recovered it with the private key. Anyone can lock; only the private key unlocks. Real RSA uses far larger primes and padding.">{(d) => <Body onDone={d} />}</MissionShell>; }
