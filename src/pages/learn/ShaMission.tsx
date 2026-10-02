import { useEffect, useState } from 'react';
import MissionShell from '../../components/learning/MissionShell.tsx';
import { Scene, BitPlanes3D } from '../../components/crypto/Scenes3D.tsx';
import { Err, Field, Hex, msg } from '../../components/common/ui.tsx';
import { avalanche } from '../../crypto/sha256.ts';
const ORIG = 'HELLO';
type Av = { h1: string; h2: string; changedBits: number; totalBits: number };
function Body({ onDone }: { onDone: () => void }) {
  const [mod, setMod] = useState('JELLO'); const [av, setAv] = useState<Av | null>(null); const [err, setErr] = useState<string | null>(null);
  const changed = mod.length === ORIG.length ? mod.split('').filter((c, i) => c !== ORIG[i]).length : -1;
  const valid = changed === 1;
  useEffect(() => { if (!valid) { setAv(null); return; } let live = true; avalanche(ORIG, mod).then((x) => { if (live) { setAv(x); onDone(); } }).catch((e) => live && setErr('Web Crypto failed: ' + msg(e))); return () => { live = false; }; }, [mod, valid, onDone]);
  return (<>
    <section className="panel space-y-3"><p>Original: <span className="font-mono">{ORIG}</span>. Change exactly one character, keeping the length at {ORIG.length}.</p><Field id="shm" label="Modified input" value={mod} onChange={setMod} />
      {!valid && <p role="alert" className="text-sm text-bad">{mod.length !== ORIG.length ? `Keep the length at ${ORIG.length} characters (you have ${mod.length}).` : changed === 0 ? 'That is the original. Change one letter.' : `You changed ${changed} characters. Change exactly one.`}</p>}<Err msg={err} /></section>
    {av && (<section className="panel space-y-3" aria-live="polite"><p className="font-mono text-lg">Different bits: {av.changedBits} / {av.totalBits}</p>
      <p className="text-xs text-mute">SHA-256({ORIG})</p><Hex>{av.h1}</Hex><p className="text-xs text-mute">SHA-256({mod})</p><Hex>{av.h2}</Hex>
      <Scene title="Digest bits in 3D" height={260} rx={55} tilt0={-15} caption="Front: original digest. Back: modified. Filled, lifted cells are bits that differ."><BitPlanes3D h1={av.h1} h2={av.h2} /></Scene>
      <p className="text-sm">A tiny input change can produce a very different digest. The count above is calculated from the two actual hashes.</p></section>)}</>);
}
export default function ShaMission() { return <MissionShell id="sha256" intro="A hash turns any input into a fixed 256-bit fingerprint. See what one changed letter does to it." summary="You changed a single character and measured how many of the 256 digest bits flipped. Hashes are designed so tiny input changes produce unrelated-looking digests (the avalanche effect). Hashing is not encryption.">{(d) => <Body onDone={d} />}</MissionShell>; }
