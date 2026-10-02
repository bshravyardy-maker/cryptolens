export interface AlgoInfo { name: string; path: string; category: string; difficulty: 'Introductory' | 'Intermediate' | 'Advanced'; blurb: string; shows: string }
export const ALGOS: AlgoInfo[] = [
  { name: 'Caesar Cipher', path: '/caesar', category: 'Classical', difficulty: 'Introductory', blurb: 'Shifts every letter by a fixed amount of the alphabet.', shows: 'Per-letter mapping and all 26 possible shifts.' },
  { name: 'Vigenère Cipher', path: '/vigenere', category: 'Classical', difficulty: 'Introductory', blurb: 'A repeating keyword selects a different Caesar shift for each letter.', shows: 'Repeated key and C = (P + K) mod 26 per letter.' },
  { name: 'AES', path: '/aes', category: 'Symmetric', difficulty: 'Advanced', blurb: 'Block cipher (FIPS-197) operating on a 4×4 byte state.', shows: 'Real state after every SubBytes, ShiftRows, MixColumns and AddRoundKey.' },
  { name: 'RSA', path: '/rsa', category: 'Asymmetric', difficulty: 'Intermediate', blurb: 'Public-key encryption based on modular exponentiation.', shows: 'Key derivation and the square-and-multiply trace (small primes only).' },
  { name: 'Diffie-Hellman', path: '/diffie-hellman', category: 'Key exchange', difficulty: 'Intermediate', blurb: 'Two parties derive a shared secret over a public channel.', shows: 'Public values, and both sides computing the same secret.' },
  { name: 'SHA-256', path: '/sha256', category: 'Hashing', difficulty: 'Intermediate', blurb: 'Hash function producing a 256-bit digest. It is not encryption.', shows: 'Digest and the avalanche effect as a measured Hamming distance.' },
  { name: 'Cryptanalysis', path: '/cryptanalysis', category: 'Cryptanalysis', difficulty: 'Introductory', blurb: 'Caesar brute force and letter-frequency analysis.', shows: 'Every candidate plaintext and measured letter frequencies.' },
  { name: 'CryptoLens Lab', path: '/lab', category: 'Lab', difficulty: 'Intermediate', blurb: 'Watch data move through the stages of an algorithm.', shows: 'Clickable pipeline stages with the real data at each stage.' },
];
