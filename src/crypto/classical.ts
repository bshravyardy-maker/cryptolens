export function caesar(text: string, shift: number, decrypt = false): string {
  if (!Number.isInteger(shift)) throw new Error('Shift must be a whole number.');
  const s = (((decrypt ? -shift : shift) % 26) + 26) % 26;
  return text.replace(/[a-z]/gi, (c) => {
    const b = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - b + s) % 26) + b);
  });
}
export const caesarBruteForce = (ct: string) =>
  Array.from({ length: 26 }, (_, shift) => ({ shift, text: caesar(ct, shift, true) }));

export function vigenere(text: string, key: string, decrypt = false): string {
  const k = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!k) throw new Error('Key must contain at least one letter A-Z.');
  let i = 0;
  return text.replace(/[a-z]/gi, (c) => {
    const b = c <= 'Z' ? 65 : 97;
    const sh = k.charCodeAt(i++ % k.length) - 65;
    return String.fromCharCode(((c.charCodeAt(0) - b + (decrypt ? 26 - sh : sh)) % 26) + b);
  });
}

export function letterFrequencies(text: string) {
  const counts = new Array<number>(26).fill(0);
  for (const c of text.toUpperCase()) if (c >= 'A' && c <= 'Z') counts[c.charCodeAt(0) - 65]++;
  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0) throw new Error('Text contains no letters A-Z to analyse.');
  return counts.map((count, i) => ({ letter: String.fromCharCode(65 + i), count, share: count / total }));
}
