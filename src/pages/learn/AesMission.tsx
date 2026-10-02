import { useMemo, useState } from 'react';
import MissionShell from '../../components/learning/MissionShell.tsx';
import Prediction from '../../components/learning/Prediction.tsx';
import StateView from '../../components/crypto/StateView.tsx';
import { aesEncryptSteps, bytesToHex, hexToBytes } from '../../crypto/aes.ts';
const KEY = '2b7e151628aed2a6abf7158809cf4f3c', BLOCK = '3243f6a8885a308d313198a2e0370734';
const TEXT: Record<string, string> = {
  Input: 'The 16-byte block is loaded into a 4×4 grid of bytes called the state.',
  AddRoundKey: 'Each state byte was combined (XOR) with a byte of the round key. The key enters here.',
  SubBytes: 'Every byte was replaced by another byte from a fixed lookup table (the S-box).',
  ShiftRows: 'Row 0 stayed, row 1 moved one position left, row 2 two positions, row 3 three positions. Values did not change, only positions.',
  MixColumns: 'Each column was mixed: every new byte depends on all four bytes of the old column.',
};
const GATES: Record<string, { q: string; o: string[]; c: number; h: string[]; e: string }> = {
  ShiftRows: { q: 'What do you think happens next (ShiftRows)?', o: ['The rows move', 'Every byte becomes zero', 'The key disappears'], c: 0, h: ['Look at what happened to the first row. Then look at the others.', 'ShiftRows changes positions, not byte values.'], e: 'The rows move: row r shifts left by r positions.' },
  MixColumns: { q: 'Which part of the state changes (MixColumns)?', o: ['Bytes are mixed within each column', 'Rows rotate again', 'Only the first byte'], c: 0, h: ['The step is called MixColumns. What does it work on?', 'Each output byte depends on all four bytes of its column.'], e: 'Bytes are mixed within each column, so every byte of the column can change.' },
};
function Body({ onDone }: { onDone: () => void }) {
  const steps = useMemo(() => aesEncryptSteps(hexToBytes(BLOCK), hexToBytes(KEY)), []);
  const [pos, setPos] = useState({ i: 0, p: -1 }); const [micro, setMicro] = useState(true); const [ans, setAns] = useState<Record<number, boolean>>({});
  const gates = useMemo(() => ['ShiftRows', 'MixColumns'].map((op) => steps.findIndex((s) => s.op === op)), [steps]);
  const { i } = pos; const cur = steps[i]; const last = steps.length - 1;
  const isBoundary = (j: number) => steps[j].op === 'AddRoundKey' || steps[j].op === 'Input';
  let target = micro ? i + 1 : -1; if (!micro) for (let j = i + 1; j <= last; j++) if (steps[j].op === 'AddRoundKey') { target = j; break; }
  let back = micro ? i - 1 : -1; if (!micro) for (let j = i - 1; j >= 0; j--) if (isBoundary(j)) { back = j; break; }
  const gate = target > 0 && target <= last ? gates.find((g) => g > i && g <= target) : undefined;
  const blocked = gate !== undefined && !ans[gate];
  const go = (n: number) => { setPos({ i: n, p: i }); if (n === last) onDone(); };
  return (<>
    <section className="panel" aria-labelledby="a1"><h2 id="a1" className="font-semibold">Input block: <span className="font-mono">{BLOCK}</span></h2>
      <p className="mt-1 text-sm text-mute">Modern encryption works on structured blocks of data. This is the AES-128 example from FIPS-197 Appendix B, run by the same code as the AES page.</p>
      <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Zoom level"><span className="label !mb-0">Zoom</span>
        <button className={micro ? 'btn' : 'btn-p'} aria-pressed={!micro} onClick={() => setMicro(false)}>Macro: one stop per round</button>
        <button className={micro ? 'btn-p' : 'btn'} aria-pressed={micro} onClick={() => setMicro(true)}>Micro: every operation</button></div></section>
    <section className="panel" aria-labelledby="a2"><h2 id="a2" className="font-semibold">Round {cur.round} · {cur.op}</h2>
      <div className="mt-3"><StateView state={cur.state} prev={pos.p >= 0 ? steps[pos.p].state : undefined} /></div>
      <p className="mt-3 text-sm" aria-live="polite">{TEXT[cur.op]}</p>
      <details className="mt-2 text-sm"><summary className="cursor-pointer">Technical view: state as hex</summary><code className="break-all font-mono">{bytesToHex(cur.state)}</code></details>
      <div className="mt-4 flex flex-wrap gap-2"><button className="btn" disabled={back < 0} onClick={() => go(back)}>Previous</button>
        <button className="btn-p" disabled={target < 0 || target > last || blocked} onClick={() => go(target)}>Next step</button><button className="btn" onClick={() => setPos({ i: 0, p: -1 })}>Reset</button>
        <span className="font-mono text-sm text-mute">step {i + 1} / {steps.length}</span></div>
      {blocked && <p className="mt-2 text-sm text-mute">Answer the prediction below to continue.</p>}</section>
    {gate !== undefined && (() => { const g = GATES[steps[gate].op]; return <Prediction key={gate} question={g.q} options={g.o} correct={g.c} hints={g.h} explain={g.e} onCorrect={() => setAns((a) => ({ ...a, [gate]: true }))} />; })()}</>);
}
export default function AesMission() { return <MissionShell id="aes" intro="Watch the real AES state change, one operation at a time. Step to the end of the final round to finish." summary="You followed AES from a 4×4 state through AddRoundKey, SubBytes, ShiftRows and MixColumns, using the actual intermediate states: the key is mixed in, bytes are substituted, positions move and columns are mixed.">{(d) => <Body onDone={d} />}</MissionShell>; }
