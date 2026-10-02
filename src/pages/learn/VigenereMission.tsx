import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MissionShell from '../../components/learning/MissionShell.tsx';
import Prediction from '../../components/learning/Prediction.tsx';
import { vigenere } from '../../crypto/classical.ts';
const PT = 'ATTACKATDAWN', KEY = 'LEMON', OUT = vigenere(PT, KEY);
const pos = (c: string) => c.charCodeAt(0) - 65;
function Body({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0); const [ok, setOk] = useState(false); const all = n === PT.length;
  useEffect(() => { if (all && ok) onDone(); }, [all, ok, onDone]);
  const last = n > 0 ? n - 1 : -1;
  return (<>
    <section className="panel" aria-labelledby="v1"><h2 id="v1" className="font-semibold">Message and repeating key</h2>
      <div className="mt-3 overflow-x-auto"><table className="font-mono text-sm"><tbody>
        <tr><th scope="row" className="pr-3 text-left text-mute">Message</th>{PT.split('').map((c, i) => <td key={i} className="px-1 text-center">{c}</td>)}</tr>
        <tr><th scope="row" className="pr-3 text-left text-mute">Key</th>{PT.split('').map((_, i) => <td key={i} className="px-1 text-center">{KEY[i % KEY.length]}</td>)}</tr>
        <tr><th scope="row" className="pr-3 text-left text-mute">Result</th>{PT.split('').map((_, i) => <td key={i} className="px-1 text-center text-accent">{i < n ? <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>{OUT[i]}</motion.span> : '·'}</td>)}</tr></tbody></table></div>
      <p className="mt-3 font-mono text-sm" aria-live="polite">{last >= 0 ? `${PT[last]} + ${KEY[last % KEY.length]} → ${OUT[last]}   (${pos(PT[last])} + ${pos(KEY[last % KEY.length])} = ${(pos(PT[last]) + pos(KEY[last % KEY.length])) % 26})` : 'Press the button to encrypt the first letter.'}</p>
      <div className="mt-3 flex gap-2"><button className="btn-p" disabled={all} onClick={() => setN(n + 1)}>Encrypt next letter</button><button className="btn" onClick={() => setN(0)}>Reset</button></div>
      {all && <p className="mt-3 text-sm">The key repeats to cover the full message. Technically: <span className="font-mono">C = (P + K) mod 26</span>, where K changes with each key letter.</p>}</section>
    <Prediction question="If the plaintext letter is A and the key letter is B, what is the encrypted letter?" options={['A', 'B', 'C']} correct={['A', 'B', 'C'].indexOf(vigenere('A', 'B'))} hints={['B has position 1 (A = 0). Add that to the position of A.', 'A moves forward by 1 place.']} explain="A (0) + B (1) = 1, which is B." onCorrect={() => setOk(true)} /></>);
}
export default function VigenereMission() { return <MissionShell id="vigenere" intro="A repeating keyword picks a different shift for every letter, so the same plaintext letter can encrypt differently." summary="You saw that the Vigenère key repeats over the message and each key letter sets the shift for one letter, which hides simple letter patterns.">{(d) => <Body onDone={d} />}</MissionShell>; }
