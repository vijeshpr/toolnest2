export type Theme = 'light' | 'dark';

export function getInitialTheme(): Theme {
  try {
    const s = localStorage.getItem('theme');
    if (s === 'light' || s === 'dark') return s;
  } catch { /* storage unavailable */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(t: Theme) {
  document.documentElement.classList.toggle('dark', t === 'dark');
  document.documentElement.style.colorScheme = t;
}

export function saveTheme(t: Theme) {
  try { localStorage.setItem('theme', t); } catch { /* ignore */ }
}
