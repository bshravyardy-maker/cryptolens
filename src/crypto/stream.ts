/** RC4: a classic stream cipher. Educational only; RC4 is broken and must not be used. */
export function rc4(key: number[], data: number[]): { out: number[]; keystream: number[] } {
  if (key.length === 0) throw new Error('Stream cipher needs a non-empty key.');
  const s = Array.from({ length: 256 }, (_, i) => i); let j = 0;
  for (let i = 0; i < 256; i++) { j = (j + s[i] + key[i % key.length]) & 255; [s[i], s[j]] = [s[j], s[i]]; }
  let a = 0, b = 0; const keystream = data.map(() => { a = (a + 1) & 255; b = (b + s[a]) & 255; [s[a], s[b]] = [s[b], s[a]]; return s[(s[a] + s[b]) & 255]; });
  return { out: data.map((v, i) => v ^ keystream[i]), keystream };
}
