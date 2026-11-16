import type { ReactNode } from 'react';
import { Text as RNText, type TextStyle } from 'react-native';
import { deriveColor } from './color';
import { useTheme } from './theme';

export type TextProps = {
  children: ReactNode;
  variant?: 'display' | 'title' | 'heading' | 'body' | 'bodySm' | 'label' | 'caption' | 'overline';
  tone?: 'default' | 'muted' | 'accent' | 'danger' | 'success';
  /** Marca-texto na cor-base, para trechos dentro de outro Text. */
  highlight?: boolean;
  color?: string;
  numberOfLines?: number;
};

const VARIANTS: Record<NonNullable<TextProps['variant']>, TextStyle> = {
  display: { fontSize: 40, lineHeight: 44, fontWeight: '700', letterSpacing: -0.8 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.3 },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 25, fontWeight: '400' },
  bodySm: { fontSize: 14, lineHeight: 21, fontWeight: '400' },
  label: { fontSize: 14, lineHeight: 18, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 17, fontWeight: '400' },
  overline: { fontSize: 12, lineHeight: 16, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
};

export function Text({ children, variant = 'body', tone = 'default', highlight = false, color, numberOfLines }: TextProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);

  const toneColor = {
    default: theme.text,
    muted: theme.muted,
    accent: c.base,
    danger: theme.error,
    success: theme.online,
  }[tone];
  // caption e overline são secundários por padrão
  const resolved = tone === 'default' && (variant === 'caption' || variant === 'overline') ? theme.muted : toneColor;

  return (
    <RNText
      accessibilityRole={variant === 'display' || variant === 'title' ? 'header' : undefined}
      maxFontSizeMultiplier={1.6}
      numberOfLines={numberOfLines}
      style={[
        VARIANTS[variant],
        theme.fontFamily ? { fontFamily: theme.fontFamily } : null,
        { color: resolved },
        highlight ? { backgroundColor: deriveColor(color ?? theme.color).soft, borderRadius: 4 } : null,
      ]}
    >
      {children}
    </RNText>
  );
}
