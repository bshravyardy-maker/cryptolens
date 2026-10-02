import { useState } from 'react';
import MissionShell from '../../components/learning/MissionShell.tsx';
import Prediction from '../../components/learning/Prediction.tsx';
import { Scene, AliceBob3D } from '../../components/crypto/Scenes3D.tsx';
import { Warn } from '../../components/common/ui.tsx';
import { diffieHellman } from '../../crypto/dh.ts';
const D = diffieHellman(23n, 5n, 6n, 15n);
function Body({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);
  const labels = ['Alice and Bob agree on public numbers p = 23 and g = 5. Each picks a private number and keeps it.', `Each computes a public value: Alice A = g^a mod p = ${D.A}, Bob B = g^b mod p = ${D.B}.`, `They swap public values over the open channel. Eve sees A = ${D.A} and B = ${D.B}, but not the private numbers.`, `Each combines the other's public value with their own private number. Alice gets ${D.aliceSecret}, Bob gets ${D.bobSecret}.`];
  return (<>
    <Warn>Educational values only. Real exchanges use much larger numbers.</Warn>
    <section className="panel" aria-live="polite"><p className="font-mono text-sm">Step {stage + 1} of 4</p><p className="mt-1">{labels[stage]}</p>
      {stage >= 2 && <div className="mt-3"><Scene title="Exchange in 3D" height={170} rx={20} tilt0={0}><AliceBob3D A={String(D.A)} B={String(D.B)} aliceSecret={stage >= 3 ? String(D.aliceSecret) : '?'} bobSecret={stage >= 3 ? String(D.bobSecret) : '?'} /></Scene></div>}
      {stage === 3 && <p className="mt-2 font-semibold">{D.match ? `Both sides hold ${D.aliceSecret}. They match.` : 'The values differ.'}</p>}
      <div className="mt-3 flex gap-2"><button className="btn-p" disabled={stage >= 3} onClick={() => setStage(stage + 1)}>Next</button><button className="btn" onClick={() => setStage(0)}>Reset</button></div></section>
    {stage === 3 && <Prediction question="Did Alice send the secret itself?" options={['Yes', 'No']} correct={1} hints={['Which numbers crossed the channel: A, B, or the final secret?', 'Only A and B were sent. The secret was computed separately on each side.']} explain="No. Only public values were sent; each side computed the secret locally." onCorrect={onDone} />}</>);
}
export default function DhMission() { return <MissionShell id="diffie-hellman" intro="Two people want a shared secret while Eve listens to everything they send." summary="You saw Alice and Bob compute the same secret without ever sending it: only public values crossed the channel, and recovering the private numbers from them is hard at real sizes.">{(d) => <Body onDone={d} />}</MissionShell>; }
