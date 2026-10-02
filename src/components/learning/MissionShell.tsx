import { Fragment, useCallback, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../common/ui.tsx';
import { MISSIONS, type MissionId } from '../../learning/missions.ts';
import { useMissionProgress } from '../../hooks/useMissionProgress.ts';
/** Common frame: header, mission body (re-mountable for "Try again"), and the completion panel. */
export default function MissionShell({ id, intro, summary, children }: { id: MissionId; intro: string; summary: string; children: (onDone: () => void) => ReactNode }) {
  const { finish } = useMissionProgress(); const [done, setDone] = useState(false); const [run, setRun] = useState(0);
  const idx = MISSIONS.findIndex((m) => m.id === id); const m = MISSIONS[idx]; const next = MISSIONS[idx + 1];
  const onDone = useCallback(() => { setDone(true); finish(id); }, [finish, id]);
  return (<Page title={m.title} intro={intro}>
    <nav aria-label="Breadcrumb" className="-mt-4 text-xs text-mute"><Link className="underline" to="/learn">Learn</Link> / <span aria-current="page">{m.concept}</span></nav>
    <Fragment key={run}>{children(onDone)}</Fragment>
    {done && (<section className="panel border-accent" role="status" aria-labelledby="done-h"><h2 id="done-h" className="font-semibold">Concept unlocked</h2><p className="mt-1 text-sm">{summary}</p>
      <div className="mt-3 flex flex-wrap gap-2"><Link className="btn-p" to={m.explore}>Want to see every step? Open the technical view</Link>
        {next && <Link className="btn" to={next.route}>Next mission: {next.title}</Link>}<button className="btn" onClick={() => { setDone(false); setRun(run + 1); }}>Try again</button></div></section>)}
  </Page>);
}
