import { BitPlanes3D, Scene } from '../components/crypto/Scenes3D.tsx';
import { useEffect, useState } from 'react';
import { avalanche, sha256Hex } from '../crypto/sha256.ts';
import { Err, Field, Hex, Page, msg } from '../components/common/ui.tsx';
type Av = { h1: string; h2: string; changedBits: number; totalBits: number };
export default function SHA256() {
  const [text, setText] = useState('hello'); const [hash, setHash] = useState(''); const [copied, setCopied] = useState(false);
  const [a, setA] = useState('hello'); const [b, setB] = useState('hellp'); const [av, setAv] = useState<Av | null>(null); const [err, setErr] = useState<string | null>(null);
  useEffect(() => { let live = true; sha256Hex(text).then((h) => { if (live) { setHash(h); setErr(null); } }).catch((e) => live && setErr('Web Crypto failed: ' + msg(e))); return () => { live = false; }; }, [text]);
  useEffect(() => { let live = true; avalanche(a, b).then((x) => live && setAv(x)).catch((e) => live && setErr('Web Crypto failed: ' + msg(e))); return () => { live = false; }; }, [a, b]);
  const copy = async () => { try { await navigator.clipboard.writeText(hash); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { setErr('Clipboard access was denied by the browser; select the hash and copy it manually.'); } };
  const diff = (x: string, y: string) => x.split('').map((ch, i) => <span key={i} className={ch !== y[i] ? 'bg-accent text-accentfg underline' : ''}>{ch}</span>);
  return (<Page crumb="SHA-256" title="SHA-256" intro="SHA-256 is a hash function, not encryption: it maps any input to a fixed 256-bit digest and cannot be reversed to recover the input. Hashing uses the browser's Web Crypto API.">
    <Err msg={err} />
    <section className="panel space-y-3" aria-labelledby="h-h"><h2 id="h-h" className="font-semibold">Digest</h2><Field id="s-in" label="Input (UTF-8 text; empty is valid)" value={text} onChange={setText} />
      <p className="text-sm">{hash.length * 4} bits · {hash.length} hex digits</p><p><Hex>{hash}</Hex></p>
      <div className="flex gap-2"><button className="btn" onClick={copy} disabled={!hash}>{copied ? 'Copied' : 'Copy hash'}</button><button className="btn" onClick={() => setText('')}>Reset</button></div></section>
    <section className="panel space-y-3" aria-labelledby="av-h"><h2 id="av-h" className="font-semibold">Avalanche experiment</h2>
      <div className="grid gap-3 md:grid-cols-2"><Field id="s-a" label="Original" value={a} onChange={setA} /><Field id="s-b" label="Modified" value={b} onChange={setB} /></div>
      {av && (<><p className="font-mono text-lg" aria-live="polite">Different bits: {av.changedBits} / {av.totalBits}</p>
        <Scene title="256-bit digests as layers" height={270} rx={55} tilt0={-15} caption="Front: original digest. Back: modified digest. Each cell is one bit; bits that differ are filled and lifted."><BitPlanes3D h1={av.h1} h2={av.h2} /></Scene>
        <div className="grid gap-2 md:grid-cols-2"><p className="break-all font-mono text-sm">{diff(av.h1, av.h2)}</p><p className="break-all font-mono text-sm">{diff(av.h2, av.h1)}</p></div>
        <p className="text-xs text-mute">Highlighted hex digits differ between the two digests. The count is the Hamming distance between the two 256-bit values. A good hash changes about half the bits for any input change, but a single comparison is just one sample.</p></>)}</section>
  </Page>);
}
