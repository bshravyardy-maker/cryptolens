import { AliceBob3D, Scene } from '../components/crypto/Scenes3D.tsx';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { diffieHellman } from '../crypto/dh.ts';
import { Err, Field, Page, Warn, msg, parseBig } from '../components/common/ui.tsx';
const SMALL = [[23, 5], [29, 2], [31, 3], [37, 2], [41, 6], [43, 3]];
export default function DiffieHellman() {
  const [v, setV] = useState({ p: '23', g: '5', a: '6', b: '15' });
  const set = (k: keyof typeof v) => (x: string) => setV({ ...v, [k]: x });
  const r = useMemo(() => { try { return { d: diffieHellman(parseBig('p', v.p), parseBig('g', v.g), parseBig('Alice private key', v.a), parseBig('Bob private key', v.b)), err: null as string | null }; } catch (e) { return { d: null, err: msg(e) }; } }, [v]);
  const random = () => { const [p, g] = SMALL[Math.floor(Math.random() * SMALL.length)]; const rnd = () => String(2 + Math.floor(Math.random() * (p - 4))); setV({ p: String(p), g: String(g), a: rnd(), b: rnd() }); };
  return (<Page crumb="Diffie-Hellman" title="Diffie-Hellman key exchange" intro="Alice and Bob agree on a shared secret while only exchanging public values. Each private key stays on its own side.">
    <Warn>Educational values only. Real exchanges use primes of 2048 bits or more, or elliptic curves.</Warn>
    <div className="panel grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Field id="d-p" label="p (public prime)" value={v.p} onChange={set('p')} /><Field id="d-g" label="g (public base)" value={v.g} onChange={set('g')} />
      <Field id="d-a" label="Alice private key" value={v.a} onChange={set('a')} /><Field id="d-b" label="Bob private key" value={v.b} onChange={set('b')} />
      <div className="flex gap-2"><button className="btn" onClick={random}>Randomize</button><button className="btn" onClick={() => setV({ p: '23', g: '5', a: '6', b: '15' })}>Reset</button></div></div>
    <Err msg={r.err} />
    {r.d && (<section className="panel" aria-labelledby="x-h"><h2 id="x-h" className="font-semibold">Exchange</h2>
      <div className="mt-4 grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <div className="border border-line p-3"><h3 className="font-semibold">Alice</h3><p className="font-mono text-sm">A = g^a mod p = {String(r.d.A)}</p></div>
        <div className="space-y-2 text-center font-mono text-xs text-mute"><motion.div key={String(r.d.A)} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>A = {String(r.d.A)} →</motion.div><motion.div key={String(r.d.B)} initial={{ x: 16, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>← B = {String(r.d.B)}</motion.div><p>public channel</p></div>
        <div className="border border-line p-3"><h3 className="font-semibold">Bob</h3><p className="font-mono text-sm">B = g^b mod p = {String(r.d.B)}</p></div></div>
      <div className="mt-4"><Scene title="Exchange in 3D" height={170} rx={20} tilt0={0} caption="Only the public values A and B cross the gap; private keys never leave their owner."><AliceBob3D A={String(r.d.A)} B={String(r.d.B)} aliceSecret={String(r.d.aliceSecret)} bobSecret={String(r.d.bobSecret)} /></Scene></div>
      <div className="mt-4 grid gap-4 md:grid-cols-2"><p className="font-mono text-sm">Alice: s = B^a mod p = {String(r.d.aliceSecret)}</p><p className="font-mono text-sm">Bob: s = A^b mod p = {String(r.d.bobSecret)}</p></div>
      <p className="mt-3 font-semibold" role="status">{r.d.match ? '✓ Both sides computed the same shared secret.' : '✗ The secrets differ.'}</p></section>)}
  </Page>);
}
