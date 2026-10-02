import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme.ts';
const LINKS = [['/learn', 'Learn'], ['/dashboard', 'Dashboard'], ['/algorithms', 'Algorithms'], ['/cryptanalysis', 'Cryptanalysis'], ['/lab', 'Lab'], ['/about', 'About']] as const;
const FOOT = [['/about', 'About'], ['/privacy', 'Privacy'], ['/terms', 'Terms']] as const;
export default function Layout() {
  const { dark, toggle } = useTheme(); const [open, setOpen] = useState(false);
  const cls = ({ isActive }: { isActive: boolean }) => `px-2 py-1 text-sm ${isActive ? 'border-b-2 border-accent' : 'text-mute hover:text-fg'}`;
  return (<div className="flex min-h-screen flex-col">
    <a href="#main" className="sr-only focus:not-sr-only focus:p-2">Skip to content</a>
    <header className="border-b border-line bg-panel"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <Link to="/" className="flex items-center gap-2 font-semibold"><img src="/favicon.svg" alt="" width={22} height={22} />CryptoLens</Link>
      <nav aria-label="Primary" className="hidden gap-2 md:flex">{LINKS.map(([to, t]) => <NavLink key={to} to={to} className={cls}>{t}</NavLink>)}</nav>
      <div className="flex gap-2">
        <button className="btn" onClick={toggle} aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}>{dark ? 'Light' : 'Dark'}</button>
        <button className="btn md:hidden" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button></div></div>
      {open && <nav id="mobile-nav" aria-label="Mobile" className="flex flex-col border-t border-line px-4 py-2 md:hidden">{LINKS.map(([to, t]) => <NavLink key={to} to={to} className={cls} onClick={() => setOpen(false)}>{t}</NavLink>)}</nav>}
    </header>
    <div className="flex-1"><Outlet /></div>
    <footer className="border-t border-line bg-panel"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm"><span className="font-semibold">CryptoLens</span><nav aria-label="Footer" className="flex gap-4 text-mute">{FOOT.map(([to, t]) => <Link key={to} className="underline" to={to}>{t}</Link>)}</nav></div></footer>
  </div>);
}
