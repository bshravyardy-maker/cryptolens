# CryptoLens

**An interactive cryptography visualization platform.**

CryptoLens lets you *see* what happens inside a cryptographic algorithm. Pick a topic, read how it works, study a worked example, then change the inputs in a live playground and watch the result update. Every output on screen is produced by tested algorithm code, not by hard-coded demo values.

Built as a college problem-based learning (PBL) project in cryptography. Everything runs in the browser; there is no server.

> **Educational use only.** The demos use small, historic or deliberately weak parameters. Do not use CryptoLens to protect real data.

---

## Screenshots

Add your own screenshots to a `docs/` folder and link them here:

```md
![Home page](docs/home.png)
![AES visualizer](docs/aes.png)
![Attack Lab](docs/attack-lab.png)
```

---

## Features

- **14 topic pages**, each with *How it works*, a *worked example*, a live *playground* and the *limits* of the method.
- **Warm, animated home page**: a card wall with a typing headline, a self-running Caesar demo, scroll-in cards and flipping example previews. All animation stops under the system's reduced-motion setting.
- **AES step-through visualizer** that shows the real 4×4 state after each SubBytes, ShiftRows, MixColumns and AddRoundKey step (41 steps for AES-128), with a 3D layered view and a flat fallback.
- **Attack Lab**: four attacks on deliberately weak setups you build yourself.
- **Guided Learn missions**: eight short missions with predictions, hints and local progress.
- **Visualizers** for Caesar, Vigenère, RSA, SHA-256 (avalanche experiment), Diffie-Hellman, cryptanalysis and a pipeline Lab.
- **Dark and light themes**, remembered in the browser.
- **Accessible by design**: semantic HTML, keyboard operation, visible focus, skip link, ARIA labels, and every 3D view backed by the same values in text.
- **Specific error messages**, for example "RSA needs two different primes" rather than a generic failure.

---

## Topics

| Group | Topics |
|---|---|
| Classical ciphers | Caesar, Playfair, Hill |
| Block ciphers | DES, AES, Block cipher modes (ECB vs CBC) |
| Symmetric | Stream cipher (RC4) |
| Public key | RSA |
| Hashing | SHA-512 (plus a SHA-256 avalanche lab) |
| Attacks | Cryptanalysis (Caesar brute force, letter frequency) |
| **Attack Lab** | Spot ECB mode, Reused keystream (two-time pad), Factor weak RSA, Break Vigenère |

Extra visualizer pages: Vigenère, Diffie-Hellman, SHA-256 and the CryptoLens Lab.

---

## Attack Lab

Each attack runs against a setup the demo creates itself.

| Attack | What the attacker sees | Result |
|---|---|---|
| Spot ECB mode | Ciphertext only | Detects ECB by finding repeated 16-byte blocks |
| Reused keystream | Two ciphertexts made with the same stream-cipher key | XORing them cancels the keystream; a guessed word (a crib) reveals text from the other message |
| Factor weak RSA | Public key `(n, e)` and a ciphertext | Trial division factors a small `n`, rebuilds the private key and decrypts |
| Break Vigenère | Ciphertext only | Index of coincidence finds the key length; chi-squared analysis on each column recovers the key |

Run attacks only against systems you own or have permission to test.

---

## How the code is correct

The algorithms live in `src/crypto/` and are separate from the interface. The UI imports them, and no algorithm is re-implemented inside a component. Tests check outputs against published vectors where they exist.

| Algorithm | Verified against |
|---|---|
| AES-128 / 192 / 256 | FIPS-197 Appendix B and C, including intermediate states |
| ECB and CBC with AES | NIST SP 800-38A |
| DES | Standard worked example (key `133457799BBCDFF1`), including round 1 |
| SHA-256, SHA-512 | Published digests for `abc` and the empty string |
| RC4 | Standard `Key` / `Plaintext` vector |
| Playfair | Classic *PLAYFAIR EXAMPLE* test |
| Hill | Standard 3×3 `GYBNQKURP` example |
| RSA, Diffie-Hellman | Known worked examples, round trips, shared-secret equality and invalid-input cases |

Attack code is tested too: ECB detection, keystream recovery, RSA factoring and a full Vigenère break from ciphertext alone.

---

## Tech stack

- React 18 and TypeScript (strict)
- Vite
- Tailwind CSS 3
- React Router 6
- Framer Motion
- Web Crypto API (SHA hashing)
- CSS 3D transforms for the 3D views (no WebGL, no Three.js)

---

## Getting started

Requires **Node.js 22.18 or newer** (the tests run TypeScript directly).

```bash
git clone https://github.com/bshravyardy-maker/cryptolens.git
cd cryptolens
npm install
npm run dev
```

Open the address Vite prints, usually `http://localhost:5173/`.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm test` | Run the unit tests |
| `npm run typecheck` | TypeScript check with no output files |
| `npm run build` | Typecheck, then create the production build in `dist/` |
| `npm run preview` | Serve the production build locally |

### Verification status

Checked on macOS with Node 24: `npm test` (21 of 21 passing), `npm run typecheck` (no errors) and `npm run build` (succeeds). There are no automated UI tests; the interface was checked by hand in the browser.

---

## Routes

| Path | Page |
|---|---|
| `/` | Home with the topic card wall |
| `/topic/:id` | Topic page (`caesar`, `playfair`, `hill`, `des`, `aes`, `sha512`, `stream`, `block`, `rsa`, `cryptanalysis`, `ecb-attack`, `two-time-pad`, `rsa-attack`, `vigenere-break`) |
| `/learn`, `/learn/<mission>` | Guided missions |
| `/dashboard`, `/algorithms` | Directories of every module |
| `/caesar`, `/vigenere`, `/aes`, `/rsa`, `/sha256`, `/diffie-hellman`, `/cryptanalysis` | Full step-by-step visualizers |
| `/lab` | Pipeline lab with 3D views |
| `/about`, `/privacy`, `/terms` | Project information |
| anything else | 404 page |

---

## Project structure

```
cryptolens/
├── public/                 favicon.svg
├── src/
│   ├── crypto/             algorithm and attack implementations (no UI code)
│   ├── topics/             topic text and playground wiring
│   ├── learning/           mission list and progress logic
│   ├── pages/              one file per route (learn missions in pages/learn/)
│   ├── components/         layout, shared UI, 3D scenes, learning components
│   ├── hooks/              stepper, theme, mission progress
│   ├── lib/                algorithm directory data
│   ├── App.tsx             routes
│   └── index.css           theme colours and base styles
├── tests/                  unit tests (known vectors, edge cases, attacks)
├── index.html
├── package.json
└── vite.config.ts
```

---

## Privacy

CryptoLens has no backend. Text, keys and numbers you type stay in your browser. It sets no cookies, includes no analytics and loads no third-party fonts or scripts. Two values are kept in `localStorage`: `cryptolens-theme` (light or dark) and `cryptolens-progress` (which Learn missions you finished). See the in-app Privacy page.

---

## Known limitations

- AES is shown for single blocks; encryption only.
- The 3D views use CSS transforms, not a WebGL scene.
- DES and RC4 are included to teach history and are obsolete.
- RSA here is textbook RSA without padding and with small primes.
- There are no automated UI tests.

---

## Future scope

- AES decryption and a padding-oracle attack
- Free-experiment mode in the Lab
- A WebGL (React Three Fiber) AES scene
- Digital signatures and a man-in-the-middle demo for Diffie-Hellman
- UI component tests

---

## Educational disclaimer

CryptoLens is a learning tool. It is not a cryptographic library, and nothing in it is audited for protecting real secrets. Use vetted libraries for real systems.