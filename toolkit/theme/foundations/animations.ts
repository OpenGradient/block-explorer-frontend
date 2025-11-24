export const keyframes = {
  fromLeftToRight: {
    from: {
      left: '0%',
      transform: 'translateX(0%)',
    },
    to: {
      left: '100%',
      transform: 'translateX(-100%)',
    },
  },
  shimmer: {
    '0%': { left: '-100%' },
    '100%': { left: '100%' },
  },
  pulseOpacity: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.7 },
  },
};
