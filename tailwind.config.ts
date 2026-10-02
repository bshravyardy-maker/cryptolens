import type { Config } from 'tailwindcss';
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'], darkMode: 'class',
  theme: { extend: {
    colors: { bg: 'var(--bg)', panel: 'var(--panel)', line: 'var(--line)', fg: 'var(--fg)', mute: 'var(--mute)', accent: 'var(--accent)', accentfg: 'var(--accentfg)', bad: 'var(--bad)' },
    fontFamily: { display: ['Georgia', 'Iowan Old Style', 'Palatino', 'serif'], mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'] } } },
  plugins: [],
} satisfies Config;
