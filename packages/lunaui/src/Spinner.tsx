import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { deriveColor } from './color';
import { useTheme } from './theme';

export type SpinnerProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Texto ao lado do spinner, também anunciado por leitores de tela. */
  label?: string;
  color?: string;
};

const SIZES = { xs: 16, sm: 24, md: 32, lg: 48, xl: 72 } as const;

/** Disco lunar cuja sombra desliza: nova → cheia → nova. Usado pelo Spinner e pelo Button. */
export function MoonDisc({ size, color, shade }: { size: number; color: string; shade: string }) {
  const x = useRef(new Animated.Value(-size)).current;
  const [still, setStill] = useState(false);

  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => alive && setStill(v));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (still) {
      x.setValue(size * 0.35);
      return;
    }
    x.setValue(-size);
    const loop = Animated.loop(
      Animated.timing(x, { toValue: size, duration: 2400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [x, size, still]);

  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, overflow: 'hidden' }}>
      <Animated.View
        style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: shade, transform: [{ translateX: x }] }}
      />
    </View>
  );
}

export function Spinner({ size = 'md', label, color }: SpinnerProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const d = SIZES[size];
  const vertical = size === 'lg' || size === 'xl';

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label ?? 'Carregando'}
      style={[styles.base, vertical ? styles.vertical : styles.horizontal]}
    >
      <MoonDisc size={d} color={c.base} shade={theme.trackOff} />
      {label ? <Text style={{ color: theme.muted, fontSize: 15 }}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', alignSelf: 'flex-start' },
  horizontal: { flexDirection: 'row', gap: 10 },
  vertical: { flexDirection: 'column', gap: 12 },
});
