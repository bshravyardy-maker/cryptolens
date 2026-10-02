import { vigenere } from './classical.ts';
/** Number of ciphertext blocks that repeat. Any repeat is strong evidence of ECB mode. */
export const repeatedBlocks = (blocks: string[]) => blocks.length - new Set(blocks).size;
export const xorBytes = (a: number[], b: number[]) => a.slice(0, Math.min(a.length, b.length)).map((v, i) => v ^ b[i]);
/** Two-time pad: slide a guessed word (crib) along C1⊕C2; where it is right, the other message appears. */
export function cribDrag(x: number[], crib: number[]) {
  if (crib.length === 0) throw new Error('Enter a crib: a word you guess appears in the first message.');
  const out: { pos: number; text: string; ok: boolean }[] = [];
  for (let pos = 0; pos + crib.length <= x.length; pos++) { const b = crib.map((c, i) => c ^ x[pos + i]); out.push({ pos, text: String.fromCharCode(...b), ok: b.every((v) => v >= 32 && v <= 126) }); }
  return out;
}
/** Breaks RSA with a small modulus by trial division (impossible at real key sizes). */
export function factorSmall(n: bigint, limit = 5_000_000n): { p: bigint; q: bigint; steps: bigint } {
  let steps = 0n; for (let i = 2n; i * i <= n; i += i === 2n ? 1n : 2n) { steps++; if (steps > limit) throw new Error('n is too large for trial division in this demo. That is exactly why real RSA uses huge moduli.'); if (n % i === 0n) return { p: i, q: n / i, steps }; }
  throw new Error('No factor found: n looks prime, so this is not a valid RSA modulus.');
}
const EN = [8.2, 1.5, 2.8, 4.3, 12.7, 2.2, 2.0, 6.1, 7.0, 0.15, 0.8, 4.0, 2.4, 6.7, 7.5, 1.9, 0.1, 6.0, 6.3, 9.1, 2.8, 1.0, 2.4, 0.15, 2.0, 0.07];
const ic = (col: number[]) => { const n = col.length; if (n < 2) return 0; const c = new Array<number>(26).fill(0); col.forEach((x) => c[x]++); return c.reduce((s, v) => s + v * (v - 1), 0) / (n * (n - 1)); };
/** Vigenère break: guess the key length with the index of coincidence, then solve each column like a Caesar cipher (chi-squared). */
export function breakVigenere(ct: string) {
  const L = ct.toUpperCase().replace(/[^A-Z]/g, '').split('').map((c) => c.charCodeAt(0) - 65);
  if (L.length < 60) throw new Error(`Need at least 60 letters for reliable statistics; you gave ${L.length}.`);
  const cols = (k: number) => Array.from({ length: k }, (_, c) => L.filter((_, i) => i % k === c));
  const ics = Array.from({ length: 12 }, (_, i) => cols(i + 1).reduce((s, col) => s + ic(col), 0) / (i + 1));
  const max = Math.max(...ics); const length = ics.findIndex((v) => v >= 0.9 * max) + 1;
  const key = cols(length).map((col) => { const cnt = new Array<number>(26).fill(0); col.forEach((x) => cnt[x]++); let best = 0, bestChi = Infinity;
    for (let s = 0; s < 26; s++) { const chi = EN.reduce((t, e, j) => t + (((cnt[(j + s) % 26] / col.length) * 100 - e) ** 2) / e, 0); if (chi < bestChi) { bestChi = chi; best = s; } } return String.fromCharCode(65 + best); }).join('');
  return { length, key, plaintext: vigenere(ct, key, true), ics };
}
