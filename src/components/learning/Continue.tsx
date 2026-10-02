import { Link } from 'react-router-dom';
import { useMissionProgress } from '../../hooks/useMissionProgress.ts';
import { nextMission } from '../../learning/progress.ts';
export default function ContinueLearning() {
  const { progress } = useMissionProgress(); const n = nextMission(progress);
  return (<section className="panel" aria-labelledby="cont-h"><h2 id="cont-h" className="font-semibold">Continue learning</h2>
    {n ? <p className="mt-1 text-sm">Next: <Link className="underline" to={n.route}>{n.title}</Link> ({n.concept}). Progress is stored only in this browser.</p>
      : <p className="mt-1 text-sm">All missions completed in this browser. <Link className="underline" to="/lab">Open the Lab</Link> to experiment.</p>}</section>);
}
