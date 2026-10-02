import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Matrix } from '../common/ui.tsx';

const SIZE = 232;
function Plane({ state, prev, z, dim, stepKey }: { state: number[]; prev?: number[]; z: number; dim: boolean; stepKey: string }) {
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `translateZ(${z}px)`, transformStyle: 'preserve-3d' }} className="grid grid-cols-4 gap-1">
      {[0, 1, 2, 3].flatMap((r) => [0, 1, 2, 3].map((c) => {
        const i = r + 4 * c; const changed = !dim && prev !== undefined && prev[i] !== state[i];
        return (
          <motion.div key={`${stepKey}-${i}`} initial={{ z: 0, opacity: dim ? 1 : 0.5 }} animate={{ z: changed ? 28 : 0, opacity: 1 }} transition={{ duration: 0.45, delay: (r + c) * 0.03 }}
            style={{ transformStyle: 'preserve-3d' }}
            className={`flex items-center justify-center border font-mono text-sm ${dim ? 'border-line text-mute opacity-60' : changed ? 'border-accent bg-panel text-accent' : 'border-line bg-panel'}`}>
            {state[i].toString(16).padStart(2, '0')}{changed && <span aria-hidden="true" className="ml-0.5 text-xs">Δ</span>}
          </motion.div>
        );
      }))}
    </div>
  );
}
/** AES state as stacked 3D planes: previous state behind, current state in front; bytes that changed lift toward the viewer. */
export default function StateView({ state, prev }: { state: number[]; prev?: number[] }) {
  const reduced = useReducedMotion(); const [flat, setFlat] = useState(false); const [tilt, setTilt] = useState(-25);
  const stepKey = state.join('');
  if (reduced || flat) return (
    <div><div className="mb-2 flex items-center gap-3"><p className="label !mb-0">State (flat view){reduced ? ' · reduced motion is on' : ''}</p>{!reduced && <button className="btn" onClick={() => setFlat(false)}>3D view</button>}</div>
      <div className="flex flex-wrap gap-6"><div><p className="label">Current (Δ = changed)</p><Matrix state={state} prev={prev} /></div>{prev && <div><p className="label">Previous</p><Matrix state={prev} /></div>}</div></div>);
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-3"><p className="label !mb-0">State in 3D: previous layer behind, current layer in front</p>
        <button className="btn" onClick={() => setFlat(true)}>Flat view</button>
        <label className="flex items-center gap-2 text-xs text-mute">Rotate<input type="range" min={-60} max={60} value={tilt} onChange={(e) => setTilt(Number(e.target.value))} aria-label="Rotate the 3D view" /></label></div>
      <div className="flex justify-center overflow-hidden" style={{ perspective: 900, height: 300 }} role="img" aria-label={`AES state, bytes in hex: ${state.map((b) => b.toString(16).padStart(2, '0')).join(' ')}. Changed bytes rise above the plane.`}>
        <div style={{ position: 'relative', width: SIZE, height: SIZE, marginTop: 40, transformStyle: 'preserve-3d', transform: `rotateX(55deg) rotateZ(${tilt}deg)`, transition: 'transform 0.3s' }}>
          {prev && <Plane state={prev} z={-70} dim stepKey={'p' + prev.join('')} />}
          <Plane state={state} prev={prev} z={0} dim={false} stepKey={stepKey} />
        </div></div>
      <p className="mt-1 text-xs text-mute">Bytes marked Δ differ from the previous state and rise toward you. The hex value is on every cell, so the 3D view adds no hidden information.</p>
    </div>);
}
