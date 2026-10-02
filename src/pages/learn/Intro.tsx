import { useState } from 'react';
import { motion } from 'framer-motion';
import MissionShell from '../../components/learning/MissionShell.tsx';
import Prediction from '../../components/learning/Prediction.tsx';
import { caesar } from '../../crypto/classical.ts';
const MSG = 'HELLO', SHIFT = 3;
function Body({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'plain' | 'sent' | 'opened'>('plain'); const cipher = caesar(MSG, SHIFT);
  return (<>
    <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
      <div className="panel"><p className="label">Alice</p><p className="font-mono text-xl">{phase === 'plain' ? MSG : '·····'}</p>
        <button className="btn-p mt-3" disabled={phase !== 'plain'} onClick={() => setPhase('sent')}>Encrypt and send</button></div>
      <div className="text-center text-xs text-mute"><p>channel</p>{phase !== 'plain' && <motion.p key={phase} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="font-mono text-base text-accent">{cipher} →</motion.p>}
        <p className="mt-2 border border-line p-1"><span className="font-semibold">Eve</span> sees: <span className="font-mono">{phase === 'plain' ? '(nothing yet)' : cipher}</span></p></div>
      <div className="panel"><p className="label">Bob</p><p className="font-mono text-xl">{phase === 'opened' ? caesar(cipher, SHIFT, true) : phase === 'sent' ? cipher : '????'}</p>
        <button className="btn-p mt-3" disabled={phase !== 'sent'} onClick={() => setPhase('opened')}>Decrypt with the key (shift {SHIFT})</button></div></div>
    <p className="text-sm text-mute" aria-live="polite">{phase === 'plain' ? 'Alice holds HELLO. Eve can read anything sent across the channel.' : phase === 'sent' ? `Encryption turned ${MSG} into ${cipher}. Eve sees ${cipher}, which does not look like a message. Only Bob knows the key: shift ${SHIFT}.` : 'Bob applied the key in reverse and recovered the original message.'}</p>
    {phase === 'opened' && <Prediction question="What changed when Alice encrypted HELLO?" options={['The message disappeared', 'The message was transformed', 'The message was deleted']} correct={1} hints={['Compare HELLO and KHOOR. Is anything missing, or is it different?', 'Bob got HELLO back, so the information was not lost.']} explain="Encryption transforms readable information into a form that is difficult to interpret without the required key." onCorrect={onDone} />}</>);
}
export default function Intro() { return <MissionShell id="intro" intro="Alice wants to send HELLO to Bob. Eve can see everything on the channel." summary="You just used encryption: a readable message was transformed using a key so that someone watching the channel could not read it, and Bob reversed it with the same key." >{(d) => <Body onDone={d} />}</MissionShell>; }
