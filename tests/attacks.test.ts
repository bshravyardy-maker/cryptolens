import test from 'node:test';
import assert from 'node:assert/strict';
import { breakVigenere, cribDrag, factorSmall, repeatedBlocks, xorBytes } from '../src/crypto/attacks.ts';
import { rc4 } from '../src/crypto/stream.ts';
import { vigenere } from '../src/crypto/classical.ts';
import { SAMPLE_ENGLISH } from '../src/crypto/sample.ts';
import { rsaDecrypt, rsaEncrypt, rsaKeys } from '../src/crypto/rsa.ts';
import { cbcEncrypt, ecbEncrypt, pkcs7 } from '../src/crypto/modes.ts';
import { bytesToHex, hexToBytes } from '../src/crypto/aes.ts';
const enc = (s: string) => [...new TextEncoder().encode(s)];
test('ECB repeats are detected, CBC hides them', () => {
  const key = hexToBytes('2b7e151628aed2a6abf7158809cf4f3c'), d = pkcs7(enc('ATTACK AT DAWN!!'.repeat(3)));
  assert.equal(repeatedBlocks(ecbEncrypt(d, key).map(bytesToHex)), 2); assert.equal(repeatedBlocks(cbcEncrypt(d, key, new Array<number>(16).fill(0)).map(bytesToHex)), 0);
});
test('keystream reuse leaks the plaintext XOR and a crib recovers text', () => {
  const p1 = enc('ATTACK AT DAWN'), p2 = enc('RETREAT AT DUSK'), k = enc('Secret');
  const x = xorBytes(rc4(k, p1).out, rc4(k, p2).out); assert.deepEqual(x, xorBytes(p1, p2));
  const hit = cribDrag(x, enc('ATTACK')).find((h) => h.pos === 0); assert.equal(hit?.text, 'RETREA'); assert.ok(hit?.ok); assert.throws(() => cribDrag(x, []));
});
test('RSA with small primes is factored and decrypted', () => {
  const k = rsaKeys(10007n, 10009n, 65537n), c = rsaEncrypt(12345n, k.e, k.n), f = factorSmall(k.n);
  assert.deepEqual([f.p, f.q], [10007n, 10009n]); assert.equal(rsaDecrypt(c, rsaKeys(f.p, f.q, 65537n).d, k.n), 12345n);
  assert.throws(() => factorSmall(1000000007n * 998244353n), /too large/); assert.throws(() => factorSmall(10007n), /prime/);
});
test('Vigenère is broken from ciphertext alone', () => {
  const r = breakVigenere(vigenere(SAMPLE_ENGLISH, 'LEMON')); assert.equal(r.key, 'LEMON'); assert.equal(r.length, 5);
  assert.equal(r.plaintext, SAMPLE_ENGLISH); assert.throws(() => breakVigenere('SHORT'));
});
