import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { blend, deriveColor } from './color';
import { useTheme } from './theme';

export type CardProps = {
  children: ReactNode;
  variant?: 'elevated' | 'outline' | 'soft' | 'solid';
  moon?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  color?: string;
};

const EDGE = 3;
const RADIUS = 20;
const MOON = 64;

export function Card({ children, variant = 'elevated', moon = false, onPress, accessibilityLabel, color }: CardProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const soft = blend(c.base, theme.cardBg, 0.13);

  const face =
    variant === 'solid' ? c.base : variant === 'soft' ? soft : variant === 'outline' ? 'transparent' : theme.cardBg;
  const border =
    variant === 'solid' ? c.base : variant === 'soft' ? 'transparent' : theme.cardLine;
  const edge = variant === 'solid' ? c.dark : variant === 'elevated' ? theme.cardEdge : 'transparent';
  const hasEdge = variant === 'solid' || variant === 'elevated';
  const cut = variant === 'solid' ? c.base : face === 'transparent' ? theme.cardBg : face;
  const crescent = variant === 'solid' ? c.on : c.base;

  const body = (pressed: boolean) => (
    <View style={{ borderRadius: RADIUS, backgroundColor: edge, paddingBottom: hasEdge ? EDGE : 0, marginBottom: hasEdge ? 0 : EDGE }}>
      <View
        style={{
          borderRadius: RADIUS,
          borderWidth: 2,
          borderColor: border,
          backgroundColor: face,
          padding: 18,
          gap: 8,
          overflow: 'hidden',
          transform: [{ translateY: pressed && hasEdge ? EDGE : 0 }],
        }}
      >
        {moon && (
          <>
            <View style={{ position: 'absolute', top: -22, right: -22, width: MOON, height: MOON, borderRadius: MOON / 2, backgroundColor: crescent }} />
            <View style={{ position: 'absolute', top: -22 + 6, right: -22 + 14, width: MOON, height: MOON, borderRadius: MOON / 2, backgroundColor: cut }} />
          </>
        )}
        {children}
      </View>
    </View>
  );

  if (!onPress) return <View style={{ alignSelf: 'stretch' }}>{body(false)}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={{ alignSelf: 'stretch' }}
    >
      {({ pressed }) => body(pressed)}
    </Pressable>
  );
}
