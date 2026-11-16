import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { deriveColor } from './color';
import { useTheme } from './theme';

export type ButtonProps = {
  children: string;
  onPress?: () => void;
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

const SIZES = {
  sm: { height: 36, padX: 16, font: 14 },
  md: { height: 48, padX: 24, font: 16 },
  lg: { height: 58, padX: 32, font: 18 },
} as const;
const EDGE = 3;
const MOON = 18;

function MoonSpinner({ color, shade }: { color: string; shade: string }) {
  const x = useRef(new Animated.Value(-MOON)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(x, { toValue: MOON, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [x]);
  return (
    <View style={{ width: MOON, height: MOON, borderRadius: MOON / 2, backgroundColor: color, overflow: 'hidden' }}>
      <Animated.View
        style={{ width: MOON, height: MOON, borderRadius: MOON / 2, backgroundColor: shade, transform: [{ translateX: x }] }}
      />
    </View>
  );
}

export function Button({
  children,
  onPress,
  variant = 'solid',
  size = 'md',
  color,
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const s = SIZES[size];
  const radius = theme.radius[size];
  const inactive = disabled || loading;
  const [focused, setFocused] = useState(false);
  const [box, setBox] = useState<{ w: number; h: number }>({ w: 0, h: s.height });
  const press = useRef(new Animated.Value(0)).current;

  const animate = (to: number) =>
    Animated.timing(press, { toValue: to, duration: to ? 450 : 200, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();

  const bg = disabled ? theme.disabledBg : variant === 'solid' ? c.base : variant === 'soft' ? c.soft : 'transparent';
  const fg = disabled ? theme.disabledFg : variant === 'solid' ? c.on : c.base;
  const edge = variant === 'solid' && !disabled;
  const sweepX = press.interpolate({ inputRange: [0, 1], outputRange: [box.w * 1.3, box.w * -0.4] });
  const sink = press.interpolate({ inputRange: [0, 0.15], outputRange: [0, edge ? EDGE : 0], extrapolate: 'clamp' });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      onPressIn={() => animate(1)}
      onPressOut={() => animate(0)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[
        fullWidth ? styles.full : styles.auto,
        focused && { borderWidth: 3, borderColor: theme.focus, borderRadius: radius + 3, margin: -3 },
      ]}
    >
      <View style={{ borderRadius: radius, backgroundColor: edge ? c.dark : 'transparent', paddingBottom: edge ? EDGE : 0, overflow: 'hidden' }}>
        <Animated.View
          onLayout={(e: LayoutChangeEvent) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
          style={[
            styles.face,
            {
              height: s.height,
              paddingHorizontal: s.padX,
              borderRadius: radius,
              backgroundColor: bg,
              borderWidth: variant === 'outline' ? 2 : 0,
              borderColor: disabled ? 'transparent' : c.base,
              transform: [{ translateY: sink }],
            },
          ]}
        >
          {loading && <MoonSpinner color={fg} shade={edge ? c.dark : c.soft} />}
          <Text style={{ color: fg, fontSize: s.font, fontWeight: '600' }}>{children}</Text>
          {!disabled && (
            <Animated.View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                { opacity: press.interpolate({ inputRange: [0, 0.05, 1], outputRange: [0, 1, 1] }), overflow: 'hidden', borderRadius: radius },
              ]}
            >
              <Animated.View
                style={{
                  position: 'absolute',
                  top: -box.h * 0.3,
                  width: box.h * 1.6,
                  height: box.h * 1.6,
                  borderRadius: box.h * 0.8,
                  backgroundColor: 'rgba(8,6,24,0.28)',
                  transform: [{ translateX: sweepX }],
                }}
              />
            </Animated.View>
          )}
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  auto: { alignSelf: 'flex-start' },
  full: { alignSelf: 'stretch' },
  face: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
});
