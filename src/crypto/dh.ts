import { isPrime, modPow } from './rsa.ts';
export function diffieHellman(p: bigint, g: bigint, a: bigint, b: bigint) {
  if (!isPrime(p)) throw new Error(`p = ${p} is not prime.`);
  if (g < 2n || g >= p) throw new Error('g must satisfy 1 < g < p.');
  for (const [name, x] of [['Alice', a], ['Bob', b]] as const)
    if (x < 1n || x > p - 2n) throw new Error(`${name}'s private key must satisfy 1 ≤ key ≤ p − 2.`);
  const A = modPow(g, a, p), B = modPow(g, b, p);
  const aliceSecret = modPow(B, a, p), bobSecret = modPow(A, b, p);
  return { A, B, aliceSecret, bobSecret, match: aliceSecret === bobSecret };
}
