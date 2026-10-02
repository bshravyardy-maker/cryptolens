// Educational AES (FIPS-197). State is 16 bytes in column-major order: index = row + 4*col.
const xt = (a: number) => ((a << 1) ^ (a & 0x80 ? 0x1b : 0)) & 0xff;
const rotl = (x: number, n: number) => ((x << n) | (x >> (8 - n))) & 0xff;
export const SBOX: number[] = (() => {
  const s = new Array<number>(256).fill(0);
  let p = 1, q = 1;
  do {
    p = (p ^ (p << 1) ^ (p & 0x80 ? 0x11b : 0)) & 0xff;
    q = (q ^ (q << 1)) & 0xff; q = (q ^ (q << 2)) & 0xff; q = (q ^ (q << 4)) & 0xff;
    if (q & 0x80) q ^= 0x09;
    s[p] = q ^ rotl(q, 1) ^ rotl(q, 2) ^ rotl(q, 3) ^ rotl(q, 4) ^ 0x63;
  } while (p !== 1);
  s[0] = 0x63;
  return s;
})();
function mul(a: number, b: number) { let r = 0; while (b) { if (b & 1) r ^= a; a = xt(a); b >>= 1; } return r; }

export function expandKey(key: number[]): number[][] {
  if (![16, 24, 32].includes(key.length)) throw new Error('AES key must be 16, 24 or 32 bytes (128, 192 or 256 bits).');
  const nk = key.length / 4, nr = nk + 6, w: number[][] = [];
  for (let i = 0; i < nk; i++) w.push(key.slice(4 * i, 4 * i + 4));
  let rcon = 1;
  for (let i = nk; i < 4 * (nr + 1); i++) {
    let t = [...w[i - 1]];
    if (i % nk === 0) { t = [t[1], t[2], t[3], t[0]].map((x) => SBOX[x]); t[0] ^= rcon; rcon = xt(rcon); }
    else if (nk > 6 && i % nk === 4) t = t.map((x) => SBOX[x]);
    w.push(w[i - nk].map((b, j) => b ^ t[j]));
  }
  return Array.from({ length: nr + 1 }, (_, r) => w.slice(4 * r, 4 * r + 4).flat());
}
const addRoundKey = (s: number[], k: number[]) => s.map((b, i) => b ^ k[i]);
const subBytes = (s: number[]) => s.map((b) => SBOX[b]);
const shiftRows = (s: number[]) => s.map((_, i) => { const r = i % 4, c = Math.floor(i / 4); return s[r + 4 * ((c + r) % 4)]; });
function mixColumns(s: number[]) {
  const o = [...s];
  for (let c = 0; c < 4; c++) {
    const [a0, a1, a2, a3] = s.slice(4 * c, 4 * c + 4);
    o[4 * c] = mul(a0, 2) ^ mul(a1, 3) ^ a2 ^ a3;
    o[4 * c + 1] = a0 ^ mul(a1, 2) ^ mul(a2, 3) ^ a3;
    o[4 * c + 2] = a0 ^ a1 ^ mul(a2, 2) ^ mul(a3, 3);
    o[4 * c + 3] = mul(a0, 3) ^ a1 ^ a2 ^ mul(a3, 2);
  }
  return o;
}
export interface AesStep { round: number; op: string; state: number[]; }
/** Encrypts one 16-byte block and returns every real intermediate state. */
export function aesEncryptSteps(block: number[], key: number[]): AesStep[] {
  if (block.length !== 16) throw new Error('AES block must be exactly 16 bytes.');
  const rk = expandKey(key), nr = rk.length - 1;
  let s = [...block];
  const steps: AesStep[] = [{ round: 0, op: 'Input', state: s }];
  const push = (round: number, op: string) => steps.push({ round, op, state: s });
  s = addRoundKey(s, rk[0]); push(0, 'AddRoundKey');
  for (let r = 1; r <= nr; r++) {
    s = subBytes(s); push(r, 'SubBytes');
    s = shiftRows(s); push(r, 'ShiftRows');
    if (r < nr) { s = mixColumns(s); push(r, 'MixColumns'); }
    s = addRoundKey(s, rk[r]); push(r, 'AddRoundKey');
  }
  return steps;
}
export const aesEncryptBlock = (b: number[], k: number[]) => aesEncryptSteps(b, k).at(-1)!.state;
export const hexToBytes = (h: string) => {
  const c = h.replace(/\s/g, '');
  if (!/^([0-9a-fA-F]{2})*$/.test(c) || !c) throw new Error('Enter hexadecimal bytes (two hex digits per byte).');
  return c.match(/../g)!.map((x) => parseInt(x, 16));
};
export const bytesToHex = (b: number[]) => b.map((x) => x.toString(16).padStart(2, '0')).join('');
