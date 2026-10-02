const mod = (n: number) => ((n % 26) + 26) % 26;
type M = number[][];
function det(m: M): number { if (m.length === 1) return m[0][0]; return m[0].reduce((s, v, j) => s + (j % 2 ? -1 : 1) * v * det(m.slice(1).map((r) => r.filter((_, c) => c !== j))), 0); }
function adjugate(m: M): M { const n = m.length; if (n === 1) return [[1]]; return m.map((_, i) => m.map((__, j) => { const minor = m.filter((_r, r) => r !== j).map((r) => r.filter((_c, c) => c !== i)); return ((i + j) % 2 ? -1 : 1) * det(minor); })); }
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
export function hillMatrix(key: string): M {
  const k = key.toUpperCase().replace(/[^A-Z]/g, ''); const n = Math.round(Math.sqrt(k.length));
  if (![2, 3].includes(n) || n * n !== k.length) throw new Error(`Hill key needs 4 letters (2×2) or 9 letters (3×3); you gave ${k.length}.`);
  return Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => k.charCodeAt(r * n + c) - 65));
}
export function hill(text: string, key: string, decrypt = false): string {
  const m = hillMatrix(key); const n = m.length; const d = mod(det(m));
  if (gcd(d, 26) !== 1) throw new Error(`This key is not usable: its determinant is ${d} (mod 26), which shares a factor with 26, so the matrix has no inverse. Try another key.`);
  let use = m; if (decrypt) { let inv = 1; while (mod(d * inv) !== 1) inv++; use = adjugate(m).map((r) => r.map((v) => mod(v * inv))); }
  let t = text.toUpperCase().replace(/[^A-Z]/g, ''); if (!t) throw new Error('Enter some text with at least one letter.');
  while (t.length % n) t += 'X';
  let out = ''; for (let i = 0; i < t.length; i += n) { const v = t.slice(i, i + n).split('').map((c) => c.charCodeAt(0) - 65); for (let r = 0; r < n; r++) out += String.fromCharCode(65 + mod(use[r].reduce((s, x, c) => s + x * v[c], 0))); }
  return out;
}
