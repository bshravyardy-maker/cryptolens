import test from 'node:test';
import assert from 'node:assert/strict';
import { caesar, caesarBruteForce, vigenere, letterFrequencies } from '../src/crypto/classical.ts';
import { aesEncryptBlock, aesEncryptSteps, hexToBytes, bytesToHex, expandKey } from '../src/crypto/aes.ts';
import { rsaKeys, rsaEncrypt, rsaDecrypt, modPowSteps } from '../src/crypto/rsa.ts';
import { diffieHellman } from '../src/crypto/dh.ts';
import { sha256Hex, avalanche, hammingDistance } from '../src/crypto/sha256.ts';

test('Caesar', () => {
  assert.equal(caesar('HELLO, World!', 3), 'KHOOR, Zruog!');
  assert.equal(caesar('KHOOR, Zruog!', 3, true), 'HELLO, World!');
  assert.equal(caesar('abc', -1), 'zab');
  assert.equal(caesar('abc', 29), 'def');
  assert.throws(() => caesar('a', 1.5));
  assert.equal(caesarBruteForce('KHOOR')[3].text, 'HELLO');
  assert.equal(caesarBruteForce('KHOOR').length, 26);
});
test('Vigenere', () => {
  assert.equal(vigenere('ATTACKATDAWN', 'LEMON'), 'LXFOPVEFRNHR');
  assert.equal(vigenere('LXFOPVEFRNHR', 'LEMON', true), 'ATTACKATDAWN');
  assert.equal(vigenere('Attack at dawn!', 'lemon'), 'Lxfopv ef rnhr!');
  assert.throws(() => vigenere('abc', '123'));
});
test('Frequency analysis', () => {
  const f = letterFrequencies('AAB!');
  assert.equal(f[0].count, 2); assert.ok(Math.abs(f[0].share - 2 / 3) < 1e-12);
  assert.throws(() => letterFrequencies('123'));
});
test('AES FIPS-197 Appendix C vectors', () => {
  const pt = hexToBytes('00112233445566778899aabbccddeeff');
  const k = (n: number) => hexToBytes(Array.from({ length: n }, (_, i) => i.toString(16).padStart(2, '0')).join(''));
  assert.equal(bytesToHex(aesEncryptBlock(pt, k(16))), '69c4e0d86a7b0430d8cdb78070b4c55a');
  assert.equal(bytesToHex(aesEncryptBlock(pt, k(24))), 'dda97ca4864cdfe06eaf70a0ec0d7191');
  assert.equal(bytesToHex(aesEncryptBlock(pt, k(32))), '8ea2b7ca516745bfeafc49904b496089');
});
test('AES FIPS-197 Appendix B + intermediate states', () => {
  const key = hexToBytes('2b7e151628aed2a6abf7158809cf4f3c');
  const steps = aesEncryptSteps(hexToBytes('3243f6a8885a308d313198a2e0370734'), key);
  assert.equal(bytesToHex(steps.at(-1)!.state), '3925841d02dc09fbdc118597196a0b32');
  assert.equal(bytesToHex(steps[1].state), '193de3bea0f4e22b9ac68d2ae9f84808'); // start of round 1
  assert.equal(bytesToHex(steps[2].state), 'd42711aee0bf98f1b8b45de51e415230'); // after SubBytes
  assert.equal(bytesToHex(expandKey(key)[1]), 'a0fafe1788542cb123a339392a6c7605');
  assert.throws(() => aesEncryptBlock(new Array(16).fill(0), [1, 2, 3]));
});
test('RSA', () => {
  const k = rsaKeys(61n, 53n, 17n);
  assert.equal(k.n, 3233n); assert.equal(k.phi, 3120n); assert.equal(k.d, 2753n);
  const c = rsaEncrypt(65n, k.e, k.n);
  assert.equal(c, 2790n); assert.equal(rsaDecrypt(c, k.d, k.n), 65n);
  assert.equal(modPowSteps(65n, 17n, 3233n).at(-1)!.result, 2790n);
  assert.throws(() => rsaKeys(60n, 53n, 17n), /not prime/);
  assert.throws(() => rsaKeys(61n, 61n, 17n), /different/);
  assert.throws(() => rsaKeys(61n, 53n, 12n), /coprime/);
  assert.throws(() => rsaEncrypt(3233n, 17n, 3233n));
});
test('Diffie-Hellman', () => {
  const r = diffieHellman(23n, 5n, 6n, 15n);
  assert.equal(r.A, 8n); assert.equal(r.B, 19n); assert.equal(r.aliceSecret, 2n); assert.ok(r.match);
  assert.throws(() => diffieHellman(24n, 5n, 6n, 15n));
});
test('SHA-256', async () => {
  assert.equal(await sha256Hex('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  assert.equal(await sha256Hex(''), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  assert.equal(hammingDistance('0f', 'f0'), 8);
  const a = await avalanche('hello', 'hellp');
  assert.ok(a.changedBits > 0 && a.changedBits <= 256);
});
