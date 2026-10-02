import test from 'node:test';
import assert from 'node:assert/strict';
import { playfair } from '../src/crypto/playfair.ts';
import { hill } from '../src/crypto/hill.ts';
import { desBlock } from '../src/crypto/des.ts';
import { rc4 } from '../src/crypto/stream.ts';
import { cbcEncrypt, ecbEncrypt, pkcs7 } from '../src/crypto/modes.ts';
import { sha512Hex } from '../src/crypto/sha512.ts';
import { bytesToHex, hexToBytes } from '../src/crypto/aes.ts';
test('Playfair', () => {
  const r = playfair('Hide the gold in the tree stump', 'PLAYFAIR EXAMPLE');
  assert.equal(r.digraphs.join(' '), 'HI DE TH EG OL DI NT HE TR EX ES TU MP'); assert.equal(r.output, 'BMODZBXDNABEKUDMUIXMMOUVIF');
  assert.equal(playfair(r.output, 'PLAYFAIR EXAMPLE', true).output, 'HIDETHEGOLDINTHETREXESTUMP');
  assert.throws(() => playfair('abc', '123')); assert.throws(() => playfair('abc', 'KEY', true));
});
test('Hill', () => {
  assert.equal(hill('ACT', 'GYBNQKURP'), 'POH'); assert.equal(hill('POH', 'GYBNQKURP', true), 'ACT');
  assert.equal(hill('HELP', 'DDCF', false).length, 4); assert.equal(hill(hill('HELP', 'DDCF'), 'DDCF', true), 'HELP');
  assert.throws(() => hill('ACT', 'AAAA'), /no inverse/); assert.throws(() => hill('ACT', 'ABC'), /4 letters/);
});
test('DES', () => {
  const r = desBlock('0123456789ABCDEF', '133457799BBCDFF1');
  assert.equal(r.hex, '85E813540F0AB405'); assert.equal(r.rounds[0].L, 'F0AAF0AA'); assert.equal(r.rounds[0].R, 'EF4A6544');
  assert.equal(desBlock('85E813540F0AB405', '133457799BBCDFF1', true).hex, '0123456789ABCDEF'); assert.throws(() => desBlock('01', '133457799BBCDFF1'));
});
test('RC4 stream cipher', () => {
  const enc = (s: string) => [...new TextEncoder().encode(s)];
  assert.equal(bytesToHex(rc4(enc('Key'), enc('Plaintext')).out), 'bbf316e8d940af0ad3');
  assert.deepEqual(rc4(enc('Key'), rc4(enc('Key'), enc('hi')).out).out, enc('hi')); assert.throws(() => rc4([], [1]));
});
test('Block cipher modes (NIST SP 800-38A)', () => {
  const key = hexToBytes('2b7e151628aed2a6abf7158809cf4f3c'), pt = hexToBytes('6bc1bee22e409f96e93d7e117393172a');
  assert.equal(bytesToHex(ecbEncrypt(pt, key)[0]), '3ad77bb40d7a3660a89ecaf32466ef97');
  assert.equal(bytesToHex(cbcEncrypt(pt, key, hexToBytes('000102030405060708090a0b0c0d0e0f'))[0]), '7649abac8119b246cee98e9b12e9197d');
  const two = [...pt, ...pt]; const e = ecbEncrypt(two, key), c = cbcEncrypt(two, key, new Array<number>(16).fill(0));
  assert.equal(bytesToHex(e[0]), bytesToHex(e[1])); assert.notEqual(bytesToHex(c[0]), bytesToHex(c[1]));
  assert.equal(pkcs7([1, 2, 3]).length, 16); assert.equal(pkcs7(new Array<number>(16).fill(1)).length, 32); assert.throws(() => ecbEncrypt([1], key));
});
test('SHA-512', async () => { assert.equal(await sha512Hex('abc'), 'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f'); });
