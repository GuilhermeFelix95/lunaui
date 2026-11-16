import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { blend, deriveColor } from './color';
import { useTheme } from './theme';

export type ChipProps = {
  label: string;
  /** Quando definido, vira botão alternável. */
  selected?: boolean;
  onPress?: () => void;
  count?: number;
  /** Elemento à esquerda (ponto, ícone...). */
  start?: ReactNode;
  onRemove?: () => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  color?: string;
};

const EDGE = 3;

export function Chip({ label, selected, onPress, count, start, onRemove, size = 'md', disabled = false, color }: ChipProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const on = !!selected;
  const sm = size === 'sm';
  const fg = on ? c.base : theme.text;

  const face = (pressed: boolean) => (
    <View
      style={{
        minHeight: sm ? 32 : 40,
        paddingHorizontal: sm ? 10 : 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderRadius: sm ? 12 : 14,
        borderWidth: 2,
        borderColor: on ? c.base : theme.cardLine,
        backgroundColor: on ? blend(c.base, theme.cardBg, 0.15) : theme.cardBg,
        transform: [{ translateY: pressed ? 2 : 0 }],
      }}
    >
      {start}
      <Text style={{ color: fg, fontSize: sm ? 13 : 14, fontWeight: '600', fontFamily: theme.fontFamily }}>{label}</Text>
      {count !== undefined ? (
        <View
          style={{
            minWidth: 20,
            height: 20,
            paddingHorizontal: 6,
            borderRadius: 8,
            backgroundColor: on ? c.base : blend(c.base, theme.cardBg, 0.15),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: on ? c.on : c.base, fontSize: 11, fontWeight: '600' }}>{count}</Text>
        </View>
      ) : null}
      {onRemove ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remover ${label}`}
          onPress={onRemove}
          hitSlop={10}
          style={{ width: 20, height: 20, marginRight: -6, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: theme.muted, fontSize: 16, lineHeight: 18 }}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );

  const wrap = (pressed: boolean) => (
    <View style={{ borderRadius: sm ? 12 : 14, backgroundColor: on ? c.dark : theme.cardEdge, paddingBottom: EDGE, opacity: disabled ? 0.45 : 1 }}>
      {face(pressed)}
    </View>
  );

  if (!onPress) return <View accessibilityLabel={label}>{wrap(false)}</View>;
  return (
    <Pressable
      accessibilityRole={selected !== undefined ? 'togglebutton' : 'button'}
      accessibilityLabel={count !== undefined ? `${label}, ${count}` : label}
      accessibilityState={{ selected: on, disabled }}
      disabled={disabled}
      hitSlop={sm ? 6 : 0}
      onPress={onPress}
    >
      {({ pressed }) => wrap(pressed)}
    </Pressable>
  );
}
