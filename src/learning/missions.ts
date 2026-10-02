export const MISSIONS = [
  { id: 'intro', title: 'Send a Secret', concept: 'What is encryption?', blurb: 'Help Alice send HELLO to Bob while Eve watches the channel.', length: 'Short interactive', route: '/learn/intro', explore: '/caesar' },
  { id: 'caesar', title: 'Crack the Message', concept: 'Caesar cipher', blurb: 'Find the shift that turns an intercepted message back into words.', length: 'Short interactive', route: '/learn/caesar', explore: '/caesar' },
  { id: 'vigenere', title: 'The Key That Repeats', concept: 'Vigenère cipher', blurb: 'Watch a repeating keyword choose a different shift for every letter.', length: 'Short interactive', route: '/learn/vigenere', explore: '/vigenere' },
  { id: 'aes', title: 'Inside the AES Machine', concept: 'AES', blurb: 'Step through the real state matrix, round by round, with predictions.', length: 'Deep dive', route: '/learn/aes', explore: '/aes' },
  { id: 'rsa', title: 'Build a Public Key', concept: 'RSA', blurb: 'Construct a key pair from two primes, lock a number, unlock it.', length: 'Deep dive', route: '/learn/rsa', explore: '/rsa' },
  { id: 'diffie-hellman', title: 'The Secret You Never Send', concept: 'Diffie-Hellman', blurb: 'Two people end up with the same secret without ever sending it.', length: 'Short interactive', route: '/learn/diffie-hellman', explore: '/diffie-hellman' },
  { id: 'sha256', title: 'Change One Letter', concept: 'SHA-256', blurb: 'Change one character and count how many digest bits flip.', length: 'Short interactive', route: '/learn/sha256', explore: '/sha256' },
  { id: 'cryptanalysis', title: 'Intercepted Transmission', concept: 'Cryptanalysis', blurb: 'Crack a Caesar message using brute force and letter counts.', length: 'Deep dive', route: '/learn/cryptanalysis', explore: '/cryptanalysis' },
] as const;
export type MissionId = (typeof MISSIONS)[number]['id'];
