export const isPrime = (n: bigint) => { if (n < 2n) return false; for (let i = 2n; i * i <= n; i++) if (n % i === 0n) return false; return true; };
export const gcd = (a: bigint, b: bigint): bigint => (b === 0n ? a : gcd(b, a % b));
export function modPow(b: bigint, e: bigint, m: bigint) { let r = 1n; b %= m; while (e > 0n) { if (e & 1n) r = (r * b) % m; b = (b * b) % m; e >>= 1n; } return r; }
/** Square-and-multiply trace, one entry per exponent bit. */
export function modPowSteps(b: bigint, e: bigint, m: bigint) {
  const bits = e.toString(2); let r = 1n; const steps = [];
  for (const bit of bits) { r = (r * r) % m; if (bit === '1') r = (r * b) % m; steps.push({ bit, result: r }); }
  return steps;
}
function modInverse(a: bigint, m: bigint) {
  let [r0, r1, t0, t1] = [m, a % m, 0n, 1n];
  while (r1 !== 0n) { const q = r0 / r1; [r0, r1] = [r1, r0 - q * r1]; [t0, t1] = [t1, t0 - q * t1]; }
  return ((t0 % m) + m) % m;
}
export function rsaKeys(p: bigint, q: bigint, e: bigint) {
  if (!isPrime(p)) throw new Error(`p = ${p} is not prime.`);
  if (!isPrime(q)) throw new Error(`q = ${q} is not prime.`);
  if (p === q) throw new Error('p and q must be different primes.');
  const n = p * q, phi = (p - 1n) * (q - 1n);
  if (e <= 1n || e >= phi) throw new Error(`e must satisfy 1 < e < φ(n) = ${phi}.`);
  if (gcd(e, phi) !== 1n) throw new Error(`e must be coprime to φ(n) = ${phi}; gcd is ${gcd(e, phi)}.`);
  return { p, q, n, phi, e, d: modInverse(e, phi) };
}
export function rsaEncrypt(m: bigint, e: bigint, n: bigint) {
  if (m < 0n || m >= n) throw new Error(`Message number must satisfy 0 ≤ m < n (n = ${n}).`);
  return modPow(m, e, n);
}
export const rsaDecrypt = (c: bigint, d: bigint, n: bigint) => modPow(c, d, n);
