type Props = {
  isExpanded?: boolean;
  isCollapsed?: boolean;
  isActive?: boolean;
};

export default function useNavLinkStyleProps({ isActive }: Props) {
  return {
    itemProps: {
      variant: 'navigation' as const,
      py: 3,
      px: 4,
      display: 'flex',
      ...(isActive ? { 'data-selected': true } : {}),
      transitionProperty: 'color, border-color',
      transitionDuration: '150ms',
      transitionTimingFunction: 'ease-out',
    },
    textProps: {
      variant: 'inherit',
      fontSize: { base: '12px', lg: '13px' },
      fontWeight: isActive ? 600 : 500,
      lineHeight: '1.3',
      opacity: 1,
      fontFamily: '"JetBrains Mono", "SF Mono", "Monaco", "Inconsolata", "Fira Code", "Droid Sans Mono", "Source Code Pro", monospace',
      letterSpacing: '0.01em',
    },
  };
}
