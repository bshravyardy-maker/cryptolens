import { useState } from 'react';
import { isCorrect } from '../../learning/progress.ts';
/** Ask for a prediction. Wrong answers are never penalised: they get a hint and can retry. */
export default function Prediction({ question, options, correct, hints, explain, onCorrect }: { question: string; options: string[]; correct: number; hints: string[]; explain: string; onCorrect?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null); const [hint, setHint] = useState(-1);
  const ok = isCorrect(picked, correct);
  const pick = (i: number) => { setPicked(i); if (isCorrect(i, correct)) onCorrect?.(); };
  return (<div className="panel" role="group" aria-labelledby="pred-q"><p id="pred-q" className="font-semibold">Predict: {question}</p>
    <div className="mt-3 flex flex-wrap gap-2">{options.map((o, i) => (<button key={i} className={picked === i ? 'btn-p' : 'btn'} disabled={ok} aria-pressed={picked === i} onClick={() => pick(i)}>{o}</button>))}</div>
    <div className="mt-3 text-sm" aria-live="polite">
      {ok && <p><strong>Correct.</strong> {explain}</p>}
      {picked !== null && !ok && <p>Not quite. {hints[Math.min(Math.max(hint, 0), hints.length - 1)]} <button className="btn ml-2" onClick={() => setPicked(null)}>Try again</button></p>}
      {picked === null && hint >= 0 && <p>Hint: {hints[Math.min(hint, hints.length - 1)]}</p>}
      {!ok && picked === null && <button className="btn mt-1" onClick={() => setHint(Math.min(hint + 1, hints.length - 1))}>{hint < 0 ? 'Show a hint' : 'Another hint'}</button>}
      {!ok && picked !== null && <button className="btn mt-1" onClick={() => setHint(Math.min(hint + 1, hints.length - 1))}>Another hint</button>}</div></div>);
}
