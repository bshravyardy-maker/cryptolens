import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Learn from './pages/Learn.tsx';
import Intro from './pages/learn/Intro.tsx';
import CaesarMission from './pages/learn/CaesarMission.tsx';
import VigenereMission from './pages/learn/VigenereMission.tsx';
import AesMission from './pages/learn/AesMission.tsx';
import RsaMission from './pages/learn/RsaMission.tsx';
import DhMission from './pages/learn/DhMission.tsx';
import ShaMission from './pages/learn/ShaMission.tsx';
import CryptanalysisMission from './pages/learn/CryptanalysisMission.tsx';
import TopicPage from './pages/Topic.tsx';
import Layout from './components/layout/Layout.tsx';
import Home from './pages/Home.tsx';
import Directory from './pages/Directory.tsx';
import Caesar from './pages/Caesar.tsx';
import Vigenere from './pages/Vigenere.tsx';
import AES from './pages/AES.tsx';
import RSA from './pages/RSA.tsx';
import SHA256 from './pages/SHA256.tsx';
import DiffieHellman from './pages/DiffieHellman.tsx';
import Cryptanalysis from './pages/Cryptanalysis.tsx';
import Lab from './pages/Lab.tsx';
import { About, Privacy, Terms, NotFound } from './pages/Static.tsx';
export default function App() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (<Routes><Route element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="dashboard" element={<Directory mode="dashboard" />} />
    <Route path="algorithms" element={<Directory mode="algorithms" />} />
    <Route path="caesar" element={<Caesar />} /><Route path="vigenere" element={<Vigenere />} />
    <Route path="aes" element={<AES />} /><Route path="rsa" element={<RSA />} />
    <Route path="sha256" element={<SHA256 />} /><Route path="diffie-hellman" element={<DiffieHellman />} />
    <Route path="cryptanalysis" element={<Cryptanalysis />} /><Route path="lab" element={<Lab />} />
    <Route path="about" element={<About />} /><Route path="privacy" element={<Privacy />} /><Route path="terms" element={<Terms />} />
    <Route path="learn" element={<Learn />} /><Route path="learn/intro" element={<Intro />} /><Route path="learn/caesar" element={<CaesarMission />} /><Route path="learn/vigenere" element={<VigenereMission />} /><Route path="learn/aes" element={<AesMission />} /><Route path="learn/rsa" element={<RsaMission />} /><Route path="learn/diffie-hellman" element={<DhMission />} /><Route path="learn/sha256" element={<ShaMission />} /><Route path="learn/cryptanalysis" element={<CryptanalysisMission />} />
    <Route path="topic/:id" element={<TopicPage />} />
    <Route path="404" element={<NotFound />} /><Route path="*" element={<NotFound />} />
  </Route></Routes>);
}
