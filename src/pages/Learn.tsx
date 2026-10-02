import { Link } from 'react-router-dom';
import { Page } from '../components/common/ui.tsx';
import ContinueLearning from '../components/learning/Continue.tsx';
import { useMissionProgress } from '../hooks/useMissionProgress.ts';
import { MISSIONS, type MissionId } from '../learning/missions.ts';
export default function Learn() {
  const { progress, reset } = useMissionProgress();
  const node = (id: MissionId) => { const m = MISSIONS.find((x) => x.id === id)!; return <Link className="underline" to={m.route}>{m.concept}{progress[id] ? ' ✓ completed' : ''}</Link>; };
  return (<Page title="Don't just read cryptography. Watch it happen." intro="Learn by changing data, making predictions, and seeing the transformation. Every result comes from the same code the unit tests check.">
    <div className="flex flex-wrap gap-2"><Link className="btn-p" to="/learn/intro">Start first mission</Link><Link className="btn" to="/algorithms">Explore algorithms</Link></div>
    <ContinueLearning />
    <section aria-labelledby="path-h"><h2 id="path-h" className="mb-3 font-semibold">Your path</h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{MISSIONS.map((m, i) => (<li key={m.id} className="panel"><p className="label">{i + 1} · {m.concept}</p><h3 className="font-semibold">{m.title}</h3><p className="mt-1 text-sm text-mute">{m.blurb}</p>
        <p className="mt-2 text-xs text-mute">{m.length} · {progress[m.id] ? 'Completed' : 'Not started'}</p><Link className="btn mt-2 inline-block" to={m.route}>{progress[m.id] ? 'Replay' : 'Start'}</Link></li>))}</ul></section>
    <section className="panel" aria-labelledby="map-h"><h2 id="map-h" className="font-semibold">Knowledge map</h2>
      <p className="text-sm text-mute">Missions build on each other but none are locked; start anywhere.</p>
      <ul className="mt-3 space-y-2 text-sm"><li>{node('intro')}<ul className="ml-4 mt-1 space-y-1 border-l border-line pl-3">
        <li>Classical ciphers<ul className="ml-4 border-l border-line pl-3"><li>{node('caesar')}</li><li>{node('vigenere')}</li></ul></li>
        <li>Modern cryptography<ul className="ml-4 border-l border-line pl-3"><li>{node('aes')}</li><li>{node('rsa')}<ul className="ml-4 border-l border-line pl-3"><li>{node('diffie-hellman')}</li></ul></li><li>{node('sha256')}</li></ul></li>
        <li>{node('cryptanalysis')} → <Link className="underline" to="/lab">CryptoLens Lab</Link></li></ul></li></ul></section>
    <p className="text-xs text-mute">Progress is saved in this browser's localStorage only. <button className="underline" onClick={reset}>Reset progress</button></p>
  </Page>);
}
