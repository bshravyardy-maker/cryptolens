import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../components/common/ui.tsx';
const P = ({ children }: { children: ReactNode }) => <p className="max-w-3xl">{children}</p>;
const H = ({ children }: { children: ReactNode }) => <h2 className="pt-2 text-lg font-semibold">{children}</h2>;
export const About = () => (<Page title="About CryptoLens">
  <H>What it is</H><P>CryptoLens is a student project that shows how cryptographic algorithms transform data, one stage at a time. It is a browser application; nothing runs on a server.</P>
  <H>Why it exists</H><P>Descriptions of AES or RSA are easier to follow when you can change an input and watch each intermediate value update. Each page shows the input, the intermediate states and the output side by side.</P>
  <H>Algorithms covered</H><P>Caesar, Vigenère, AES (128, 192 and 256-bit keys), RSA with small primes, SHA-256, Diffie-Hellman, Caesar brute force and letter-frequency analysis.</P>
  <H>Project context</H><P>Built as a college problem-based learning (PBL) project. The algorithm code is separate from the interface and is covered by unit tests using published test vectors where they exist. See the <Link className="underline" to="/lab">Lab</Link> or the <Link className="underline" to="/algorithms">algorithm list</Link>.</P></Page>);
export const Privacy = () => (<Page title="Privacy Policy">
  <H>What is processed</H><P>Text, keys and numbers you type are processed by JavaScript in your browser. CryptoLens does not send them anywhere, because the application has no server component and makes no network requests with your input.</P>
  <H>Local storage</H><P>Two values are kept in your browser's localStorage: <code>cryptolens-theme</code> (your light or dark choice) and <code>cryptolens-progress</code> (which Learn missions you completed). They never leave your device and nothing else is stored. If localStorage is unavailable, progress lasts only for the current visit.</P>
  <H>Cookies, analytics, third parties</H><P>The application sets no cookies and includes no analytics or advertising code. It loads no third-party fonts, scripts or images. If you deploy it behind a hosting service, that host may keep its own access logs, which are outside this project's control.</P>
  <H>Clipboard</H><P>The Copy button writes the displayed SHA-256 digest to your clipboard only when you press it.</P>
  <P>Do not enter real passwords, keys or other secrets. This policy describes how the application behaves; it makes no claim of legal compliance.</P></Page>);
export const Terms = () => (<Page title="Terms and Conditions">
  <H>Educational purpose</H><P>CryptoLens is an educational student project, not a commercial service.</P>
  <H>No production security</H><P>The demonstrations use small or fixed parameters and simplified usage (for example, textbook RSA and single-block AES). They are not suitable for protecting real data, and the project makes no guarantee of security.</P>
  <H>Acceptable use</H><P>Use it to learn. Do not enter real secrets, and do not use it to attack systems you do not own or have permission to test.</P>
  <H>Intellectual property</H><P>The source code is part of the student project; check the repository for its license. Algorithm names and standards belong to their respective owners.</P>
  <H>Limitation of liability</H><P>The software is provided as is, without warranty. The authors are not liable for any loss arising from its use.</P></Page>);
export const NotFound = () => (<Page title="Algorithm not found."><P>That address does not match any CryptoLens page.</P>
  <nav aria-label="Where to go" className="flex flex-wrap gap-2"><Link className="btn-p" to="/algorithms">Algorithm explorer</Link><Link className="btn" to="/">Home</Link><Link className="btn" to="/dashboard">Dashboard</Link><Link className="btn" to="/lab">Lab</Link></nav></Page>);
