type Props = {
  isExpanded?: boolean;
  isCollapsed?: boolean;
  isActive?: boolean;
};

export default function useNavLinkStyleProps({ isActive }: Props) {
  return {
    itemProps: {
      variant: 'navigation' as const,
      py: 2.5,
      px: 3,
      display: 'flex',
      ...(isActive ? { 'data-selected': true } : {}),
      borderRadius: 'none',
      transitionProperty: 'background-color, color',
      transitionDuration: '150ms',
      transitionTimingFunction: 'ease-out',
    },
    textProps: {
      variant: 'inherit',
      fontSize: { base: '14px', lg: '15px' },
      fontWeight: isActive ? 500 : 400,
      lineHeight: '1.2',
      opacity: 1,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      letterSpacing: '0.01em',
    },
  };
}
