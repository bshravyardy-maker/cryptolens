import { Link } from 'react-router-dom';
import ContinueLearning from '../components/learning/Continue.tsx';
import { Page } from '../components/common/ui.tsx';
import { ALGOS } from '../lib/algorithms.ts';
const GROUPS = ['Classical', 'Symmetric', 'Asymmetric', 'Key exchange', 'Hashing', 'Cryptanalysis', 'Lab'];
export default function Directory({ mode }: { mode: 'dashboard' | 'algorithms' }) {
  return (<Page title={mode === 'dashboard' ? 'Dashboard' : 'Algorithms'} intro={mode === 'dashboard' ? 'Every module in CryptoLens. Difficulty is an educational classification, not a measurement.' : 'Algorithms grouped by concept. Each entry says what it demonstrates and links to its page.'}>
    {mode === 'dashboard' && <ContinueLearning />}
    {GROUPS.map((g) => { const items = ALGOS.filter((a) => a.category === g); return items.length === 0 ? null : (
      <section key={g} aria-labelledby={`g-${g}`}><h2 id={`g-${g}`} className="mb-3 text-sm uppercase tracking-wide text-mute">{g}</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map((a) => (<li key={a.path} className="panel flex flex-col">
          <h3 className="font-semibold">{a.name}</h3><p className="text-xs text-mute">{a.category} · {a.difficulty}</p>
          <p className="mt-2 text-sm">{a.blurb}</p><p className="mt-1 text-sm text-mute">Shows: {a.shows}</p>
          <Link className="btn mt-3 self-start" to={a.path} aria-label={`Explore ${a.name}`}>Explore</Link></li>))}</ul></section>); })}
  </Page>);
}
