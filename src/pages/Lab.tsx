import { DepthStack, Scene } from '../components/crypto/Scenes3D.tsx';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { caesar, vigenere } from '../crypto/classical.ts';
import { aesEncryptSteps, bytesToHex, hexToBytes } from '../crypto/aes.ts';
import { modPowSteps, rsaDecrypt, rsaEncrypt, rsaKeys } from '../crypto/rsa.ts';
import { diffieHellman } from '../crypto/dh.ts';
import { sha256Hex } from '../crypto/sha256.ts';
import { Controls, Hex, Page } from '../components/common/ui.tsx';
import StateView from '../components/crypto/StateView.tsx';
import { useStepper } from '../hooks/useStepper.ts';
interface Stage { name: string; why: string; changed: string; data: string; state?: number[]; prev?: number[] }
const AES_WHY: Record<string, string> = {
  Input: 'The 16-byte block is loaded column by column into a 4×4 state.',
  AddRoundKey: 'XORs the state with a round key. This is the only step that uses the secret key.',
  SubBytes: 'Replaces every byte using the S-box. This is the non-linear step.',
  ShiftRows: 'Rotates row r left by r bytes so bytes move between columns.',
  MixColumns: 'Mixes each column with a fixed matrix over GF(2⁸), spreading each byte across its column.',
};
const ALGOS = ['AES', 'Caesar', 'Vigenère', 'RSA', 'SHA-256', 'Diffie-Hellman'] as const;
type Algo = (typeof ALGOS)[number];
function build(algo: Algo, digest: string): { stages: Stage[]; example: string } {
  if (algo === 'AES') {
    const st = aesEncryptSteps(hexToBytes('3243f6a8885a308d313198a2e0370734'), hexToBytes('2b7e151628aed2a6abf7158809cf4f3c'));
    return { example: 'FIPS-197 Appendix B: AES-128 key 2b7e1516…4f3c', stages: st.map((s, i) => { const p = i ? st[i - 1].state : undefined; const n = p ? s.state.filter((b, j) => b !== p[j]).length : 16;
      return { name: `R${s.round} ${s.op}`, why: AES_WHY[s.op], changed: `${n} of 16 bytes changed`, data: bytesToHex(s.state), state: s.state, prev: p }; }) };
  }
  if (algo === 'Caesar') { const pt = 'HELLO'; return { example: 'Plaintext HELLO, shift 3', stages: pt.split('').map((c, i) => ({ name: `${c} → ${caesar(c, 3)}`, why: 'Each letter is moved 3 places along the alphabet, wrapping after Z.', changed: `Letter ${i + 1} of ${pt.length}`, data: `${c} = ${c.charCodeAt(0) - 65}; (${c.charCodeAt(0) - 65} + 3) mod 26 = ${(c.charCodeAt(0) - 65 + 3) % 26} = ${caesar(c, 3)}` })) }; }
  if (algo === 'Vigenère') { const pt = 'ATTACKATDAWN', k = 'LEMON', out = vigenere(pt, k); return { example: 'Plaintext ATTACKATDAWN, key LEMON', stages: pt.split('').map((c, i) => { const kl = k[i % k.length]; return { name: `${c}+${kl} → ${out[i]}`, why: 'The key letter chooses the shift for this position; the key repeats.', changed: `Letter ${i + 1} of ${pt.length}`, data: `(${c.charCodeAt(0) - 65} + ${kl.charCodeAt(0) - 65}) mod 26 = ${out[i].charCodeAt(0) - 65} = ${out[i]}` }; }) }; }
  if (algo === 'RSA') { const k = rsaKeys(61n, 53n, 17n), m = 65n, tr = modPowSteps(m, k.e, k.n), c = rsaEncrypt(m, k.e, k.n);
    return { example: 'p = 61, q = 53, e = 17, m = 65 (toy values)', stages: [
      { name: 'Keys', why: 'n = p×q is public; d is the inverse of e modulo φ(n).', changed: 'Key pair derived', data: `n = ${k.n}, φ(n) = ${k.phi}, d = ${k.d}` },
      ...tr.map((t, i) => ({ name: `Bit ${i + 1}`, why: 'Square the running value, then multiply by m when the exponent bit is 1.', changed: `Exponent bit ${t.bit}`, data: `running result = ${t.result}` })),
      { name: 'Ciphertext', why: 'c = m^e mod n.', changed: 'Encrypted', data: `c = ${c}` },
      { name: 'Decrypt', why: 'm = c^d mod n recovers the message.', changed: 'Decrypted', data: `m = ${rsaDecrypt(c, k.d, k.n)}` }] }; }
  if (algo === 'SHA-256') return { example: 'Input "abc"', stages: [
    { name: 'Input bytes', why: 'The text is encoded as UTF-8 bytes.', changed: 'Text → bytes', data: bytesToHex([...new TextEncoder().encode('abc')]) },
    { name: 'Compression', why: 'The padded message goes through 64 rounds of mixing. Web Crypto does not expose the internal state, so none is shown.', changed: 'Internal state not exposed', data: '(internal)' },
    { name: 'Digest', why: 'The final 256-bit value is the hash.', changed: 'Fixed-size output', data: digest || 'computing…' }] };
  const d = diffieHellman(23n, 5n, 6n, 15n);
  return { example: 'p = 23, g = 5, Alice a = 6, Bob b = 15 (toy values)', stages: [
    { name: 'Public parameters', why: 'Both parties agree on p and g in the open.', changed: 'Shared in public', data: 'p = 23, g = 5' },
    { name: 'Alice public', why: 'A = g^a mod p is safe to send; a stays private.', changed: 'A computed', data: `A = ${d.A}` },
    { name: 'Bob public', why: 'B = g^b mod p is safe to send; b stays private.', changed: 'B computed', data: `B = ${d.B}` },
    { name: 'Shared secret', why: 'Each side raises the other\'s public value to its own private key.', changed: d.match ? 'Both sides agree' : 'Mismatch', data: `Alice: ${d.aliceSecret}, Bob: ${d.bobSecret}` }] };
}
export default function Lab() {
  const [algo, setAlgo] = useState<Algo>('AES'); const [digest, setDigest] = useState('');
  useEffect(() => { sha256Hex('abc').then(setDigest).catch(() => setDigest('Web Crypto unavailable in this browser')); }, []);
  const { stages, example } = useMemo(() => build(algo, digest), [algo, digest]);
  const s = useStepper(stages.length, 1100); const cur = stages[s.i];
  return (<Page title="CryptoLens Lab" intro="Follow a data block through the stages of an algorithm. Each stage is computed by the same implementation the unit tests cover. The Lab uses fixed example inputs; the algorithm pages let you edit them.">
    <div className="panel"><label className="label" htmlFor="lab-algo">Algorithm</label>
      <select id="lab-algo" className="field max-w-xs" value={algo} onChange={(e) => { setAlgo(e.target.value as Algo); s.reset(); }}>{ALGOS.map((a) => <option key={a}>{a}</option>)}</select>
      <p className="mt-2 text-sm text-mute">Example: {example}. <Link className="underline" to={algo === 'Diffie-Hellman' ? '/diffie-hellman' : algo === 'SHA-256' ? '/sha256' : algo === 'Vigenère' ? '/vigenere' : '/' + algo.toLowerCase()}>Open the {algo} page</Link></p></div>
    <Scene title="Pipeline in 3D" height={170} rx={35} tilt0={0} caption="The active stage is in front, later stages recede, finished stages lift away. Click a card to jump to it."><DepthStack items={stages.map((st) => ({ title: st.name, body: st.changed }))} active={s.i} onSelect={s.set} /></Scene>
    <section aria-label="Pipeline" className="panel"><ol className="flex gap-1 overflow-x-auto pb-2">{stages.map((st, i) => (<li key={i} className="shrink-0"><button onClick={() => s.set(i)} aria-current={i === s.i ? 'step' : undefined} className={`block min-w-[5.5rem] border px-2 py-2 text-left text-xs ${i === s.i ? 'border-accent' : 'border-line text-mute'}`}>
      <span className="block h-3">{i === s.i && <motion.span layoutId="block" className="inline-block h-3 w-3 bg-accent" aria-label="data block is here" />}</span>{st.name}</button></li>))}</ol>
      <div className="mt-3"><Controls s={s} /></div></section>
    {cur && (<section className="panel" aria-labelledby="det-h" aria-live="polite"><h2 id="det-h" className="font-semibold">{cur.name}</h2>
      <dl className="mt-2 space-y-2 text-sm"><div><dt className="label">What changed</dt><dd>{cur.changed}</dd></div><div><dt className="label">Why this stage exists</dt><dd>{cur.why}</dd></div><div><dt className="label">Current data</dt><dd><Hex>{cur.data}</Hex></dd></div></dl>
      {cur.state && <div className="mt-4"><StateView state={cur.state} prev={cur.prev} /></div>}</section>)}
    <p className="text-xs text-mute">AES stages use a 3D state view built with CSS 3D transforms (no WebGL). It switches to a flat view when reduced motion is on, or when you choose Flat view.</p>
  </Page>);
}
