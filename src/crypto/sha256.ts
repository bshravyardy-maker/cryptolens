export async function sha256Hex(text: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(d)].map((x) => x.toString(16).padStart(2, '0')).join('');
}
export function hammingDistance(h1: string, h2: string): number {
  if (h1.length !== h2.length) throw new Error('Hashes must have equal length.');
  let n = 0;
  for (let i = 0; i < h1.length; i++) { let x = parseInt(h1[i], 16) ^ parseInt(h2[i], 16); while (x) { n += x & 1; x >>= 1; } }
  return n;
}
export async function avalanche(a: string, b: string) {
  const [h1, h2] = await Promise.all([sha256Hex(a), sha256Hex(b)]);
  return { h1, h2, changedBits: hammingDistance(h1, h2), totalBits: 256 };
}
