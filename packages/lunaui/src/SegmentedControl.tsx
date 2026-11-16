import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { deriveColor } from './color';
import { useTheme } from './theme';
import { useReduceMotion } from './useReduceMotion';

export type SegmentOption = {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export type SegmentedControlProps = {
  /** De 2 a 4 opções. */
  options: SegmentOption[];
  value: string;
  onValueChange: (value: string) => void;
  size?: 'sm' | 'md';
  /** Segmentos de largura igual ocupando toda a linha. */
  fullWidth?: boolean;
  accessibilityLabel?: string;
  color?: string;
};

type Box = { x: number; w: number };

export function SegmentedControl({ options, value, onValueChange, size = 'md', fullWidth = true, accessibilityLabel, color }: SegmentedControlProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const reduce = useReduceMotion();
  const boxes = useRef<Record<string, Box>>({});
  const x = useRef(new Animated.Value(0)).current;
  const w = useRef(new Animated.Value(0)).current;
  const placed = useRef(false);
  const [, bump] = useState(0);

  const moveTo = (b: Box) => {
    if (!placed.current || reduce) {
      x.setValue(b.x);
      w.setValue(b.w);
      placed.current = true;
      return;
    }
    Animated.parallel([
      Animated.timing(x, { toValue: b.x, duration: 280, useNativeDriver: false }),
      Animated.timing(w, { toValue: b.w, duration: 280, useNativeDriver: false }),
    ]).start();
  };

  useEffect(() => {
    const b = boxes.current[value];
    if (b) moveTo(b);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={{
        flexDirection: 'row',
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        backgroundColor: theme.trackOff,
        borderRadius: 18,
        padding: 4,
        borderBottomWidth: 2,
        borderBottomColor: theme.trackOffEdge,
      }}
    >
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          left: 0,
          width: w,
          borderRadius: 14,
          borderWidth: 2,
          borderColor: theme.cardLine,
          backgroundColor: theme.cardBg,
          transform: [{ translateX: x }],
        }}
      />
      {options.slice(0, 4).map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="radio"
            accessibilityLabel={o.label}
            accessibilityState={{ checked: selected, disabled: !!o.disabled }}
            disabled={o.disabled}
            onPress={() => onValueChange(o.value)}
            onLayout={(e) => {
              const { x: lx, width } = e.nativeEvent.layout;
              boxes.current[o.value] = { x: lx, w: width };
              if (o.value === value) moveTo({ x: lx, w: width });
              bump((n) => n + 1);
            }}
            style={{
              flex: fullWidth ? 1 : undefined,
              minHeight: size === 'sm' ? 34 : 42,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderRadius: 14,
              opacity: o.disabled ? 0.4 : 1,
            }}
          >
            {o.icon}
            <Text style={{ color: selected ? c.base : theme.muted, fontSize: size === 'sm' ? 13 : 14.5, fontWeight: '600', fontFamily: theme.fontFamily }}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
