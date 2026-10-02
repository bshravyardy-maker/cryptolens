const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const clean = (s: string) => s.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
/** 5×5 key square, J merged into I. */
export function playfairSquare(key: string): string[] {
  const k = clean(key); if (!k) throw new Error('Playfair needs a key with at least one letter A-Z.');
  return [...new Set((k + ABC.replace('J', '')).split(''))];
}
/** Splits text into digraphs: a repeated letter gets an X after it; an odd last letter is padded with X. */
export function playfairPrepare(text: string): string[] {
  const t = clean(text); if (!t) throw new Error('Enter some text with at least one letter.');
  const out: string[] = []; let i = 0;
  while (i < t.length) { const a = t[i], b = t[i + 1]; if (b === undefined || a === b) { out.push(a + 'X'); i += 1; } else { out.push(a + b); i += 2; } }
  return out;
}
export function playfair(text: string, key: string, decrypt = false): { square: string[]; digraphs: string[]; output: string } {
  const sq = playfairSquare(key); const pairs = decrypt ? (() => { const t = clean(text); if (!t || t.length % 2) throw new Error('Ciphertext must have an even number of letters.'); return t.match(/../g)!; })() : playfairPrepare(text);
  const step = decrypt ? 4 : 1; const at = (c: string) => sq.indexOf(c);
  const output = pairs.map(([a, b]) => { const ia = at(a), ib = at(b), ra = Math.floor(ia / 5), ca = ia % 5, rb = Math.floor(ib / 5), cb = ib % 5;
    if (ra === rb) return sq[ra * 5 + ((ca + step) % 5)] + sq[rb * 5 + ((cb + step) % 5)];
    if (ca === cb) return sq[((ra + step) % 5) * 5 + ca] + sq[((rb + step) % 5) * 5 + cb];
    return sq[ra * 5 + cb] + sq[rb * 5 + ca]; }).join('');
  return { square: sq, digraphs: pairs, output };
}
