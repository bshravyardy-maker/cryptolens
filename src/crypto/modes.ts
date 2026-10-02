import { aesEncryptBlock } from './aes.ts';
export const pkcs7 = (b: number[]) => { const p = 16 - (b.length % 16); return [...b, ...new Array<number>(p).fill(p)]; };
const blocks = (d: number[]) => { if (d.length === 0 || d.length % 16) throw new Error('Data length must be a non-zero multiple of 16 bytes (pad it first).'); return Array.from({ length: d.length / 16 }, (_, i) => d.slice(i * 16, i * 16 + 16)); };
/** ECB: every block is encrypted independently, so equal plaintext blocks give equal ciphertext blocks. */
export const ecbEncrypt = (data: number[], key: number[]) => blocks(data).map((b) => aesEncryptBlock(b, key));
/** CBC: each plaintext block is XORed with the previous ciphertext block (the IV for the first). */
export function cbcEncrypt(data: number[], key: number[], iv: number[]) {
  if (iv.length !== 16) throw new Error('IV must be exactly 16 bytes.');
  let prev = iv; return blocks(data).map((b) => (prev = aesEncryptBlock(b.map((v, i) => v ^ prev[i]), key)));
}
