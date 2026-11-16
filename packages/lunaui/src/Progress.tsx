import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { deriveColor } from './color';
import { useTheme } from './theme';
import { useReduceMotion } from './useReduceMotion';

export type ProgressProps = {
  /** 0 a 100. Ignorado quando `indeterminate`. */
  value?: number;
  indeterminate?: boolean;
  variant?: 'bar' | 'moon';
  /** Diâmetro da lua, em dp. */
  size?: number;
  label?: string;
  showValue?: boolean;
  color?: string;
};

export function Progress({ value = 0, indeterminate = false, variant = 'bar', size = 72, label, showValue = false, color }: ProgressProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const reduce = useReduceMotion();
  const v = Math.min(100, Math.max(0, value));
  const t = useRef(new Animated.Value(0)).current;
  const [barW, setBarW] = useState(0);

  useEffect(() => {
    if (!indeterminate || reduce) {
      t.setValue(reduce ? 0.5 : 0);
      return;
    }
    const loop = Animated.loop(Animated.timing(t, { toValue: 1, duration: variant === 'moon' ? 2400 : 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [indeterminate, reduce, variant, t]);

  const a11y = {
    accessible: true,
    accessibilityRole: 'progressbar' as const,
    accessibilityLabel: label ?? (indeterminate ? 'Carregando' : undefined),
    accessibilityValue: indeterminate ? undefined : { min: 0, max: 100, now: Math.round(v) },
  };

  if (variant === 'moon') {
    const offset = indeterminate ? t.interpolate({ inputRange: [0, 1], outputRange: [-size, size] }) : -size + (v / 100) * size;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }} {...a11y}>
        <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: theme.trackOff, overflow: 'hidden', borderWidth: 2, borderColor: theme.cardLine }}>
          <Animated.View
            style={{ position: 'absolute', left: -2, top: -2, width: size, height: size, borderRadius: size / 2, backgroundColor: c.base, transform: [{ translateX: offset }] }}
          />
        </View>
        {showValue && !indeterminate ? (
          <Text style={{ color: theme.text, fontSize: 22, fontWeight: '700', fontFamily: theme.fontFamily }}>{Math.round(v)}%</Text>
        ) : null}
      </View>
    );
  }

  return (
    <View {...a11y}>
      {label || (showValue && !indeterminate) ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ color: theme.text, fontSize: 14, fontFamily: theme.fontFamily }}>{label}</Text>
          {showValue && !indeterminate ? <Text style={{ color: theme.text, fontSize: 14, fontWeight: '700', fontFamily: theme.fontFamily }}>{Math.round(v)}%</Text> : null}
        </View>
      ) : null}
      <View
        onLayout={(e) => setBarW(e.nativeEvent.layout.width)}
        style={{ height: 14, borderRadius: 8, backgroundColor: theme.trackOff, borderBottomWidth: 2, borderBottomColor: theme.trackOffEdge, overflow: 'hidden' }}
      >
        {indeterminate ? (
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: barW * 0.35,
              borderRadius: 8,
              backgroundColor: c.base,
              transform: [{ translateX: t.interpolate({ inputRange: [0, 1], outputRange: [-barW * 0.35, barW] }) }],
            }}
          />
        ) : (
          <View style={{ height: '100%', width: `${v}%`, borderRadius: 8, backgroundColor: c.base, borderBottomWidth: 2, borderBottomColor: c.dark }} />
        )}
      </View>
    </View>
  );
}
