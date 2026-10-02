import test from 'node:test';
import assert from 'node:assert/strict';
import { completeMission, isCorrect, loadProgress, nextMission, PROGRESS_KEY, saveProgress, type Store } from '../src/learning/progress.ts';
const fake = (init?: string): Store & { data: Map<string, string> } => { const data = new Map<string, string>(); if (init !== undefined) data.set(PROGRESS_KEY, init); return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => { data.set(k, v); } }; };
test('progression and completion', () => {
  let p = loadProgress(fake()); assert.deepEqual(p, {}); assert.equal(nextMission(p)?.id, 'intro');
  p = completeMission(p, 'intro'); assert.equal(nextMission(p)?.id, 'caesar'); assert.equal(completeMission(p, 'intro'), p);
});
test('persistence round trip, corrupted data and unavailable storage', () => {
  const s = fake(); assert.ok(saveProgress(s, { intro: true, caesar: true })); assert.deepEqual(loadProgress(s), { intro: true, caesar: true });
  assert.deepEqual(loadProgress(fake('{not json')), {}); assert.deepEqual(loadProgress(fake('{"intro":"yes","bogus":true,"aes":true}')), { aes: true });
  assert.equal(saveProgress(null, { intro: true }), false); assert.deepEqual(loadProgress(null), {});
  assert.equal(saveProgress({ getItem: () => null, setItem: () => { throw new Error('quota'); } }, {}), false);
});
test('reset and prediction correctness', () => { const s = fake(); saveProgress(s, { intro: true }); saveProgress(s, {}); assert.deepEqual(loadProgress(s), {}); assert.ok(isCorrect(1, 1)); assert.ok(!isCorrect(null, 0)); assert.ok(!isCorrect(0, 1)); });
