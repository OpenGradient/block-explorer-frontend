export const HOME_BRAND = {
  fonts: {
    sans: '"Geist", system-ui, -apple-system, sans-serif',
    mono: '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  colors: {
    cyan: '#24bce3',
    cyanSoft: '#bdebf7',
    cyanBright: '#50c9e9',
    teal: '#0e4b5b',
    tealMid: '#1d96b6',
    navy: '#0a0f19',
    navySoft: '#0f1626',
    slate: '#314a7d',
  },
  panel: {
    bg: { _light: 'rgba(255, 255, 255, 0.82)', _dark: 'rgba(10, 15, 25, 0.72)' },
    border: { _light: 'rgba(36, 188, 227, 0.16)', _dark: 'rgba(189, 235, 247, 0.12)' },
    shadow: {
      _light: '0 14px 44px rgba(14, 75, 91, 0.08)',
      _dark: '0 22px 70px rgba(0, 0, 0, 0.28)',
    },
  },
  text: {
    primary: { _light: '#0e4b5b', _dark: 'rgba(255, 255, 255, 0.94)' },
    secondary: { _light: '#314a7d', _dark: 'rgba(189, 235, 247, 0.58)' },
    muted: { _light: 'rgba(14, 75, 91, 0.50)', _dark: 'rgba(189, 235, 247, 0.42)' },
    accent: { _light: '#1d96b6', _dark: '#50c9e9' },
  },
} as const;
