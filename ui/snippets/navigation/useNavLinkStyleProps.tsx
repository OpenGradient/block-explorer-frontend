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
      fontSize: 'sm',
      fontWeight: isActive ? 500 : 400,
      lineHeight: '20px',
      opacity: 1,
    },
  };
}
