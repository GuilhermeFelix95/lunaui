import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { deriveColor } from './color';
import { useTheme } from './theme';

export type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  color?: string;
};

const SIZES = {
  sm: { w: 44, h: 26, m: 16 },
  md: { w: 56, h: 32, m: 20 },
  lg: { w: 68, h: 40, m: 26 },
} as const;
const EDGE = 3;
const PAD = 6;

export function Switch({ value, onValueChange, accessibilityLabel, size = 'md', disabled = false, color }: SwitchProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const { w, h, m } = SIZES[size];
  const t = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(t, { toValue: value ? 1 : 0, duration: 250, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [value, t]);

  const travel = w - m - PAD * 2;
  const trackBg = disabled ? theme.disabledBg : t.interpolate({ inputRange: [0, 1], outputRange: [theme.trackOff, c.base] });
  const moonBg = disabled ? theme.disabledFg : t.interpolate({ inputRange: [0, 1], outputRange: [theme.moonOff, c.on] });
  const edgeBg = disabled ? 'transparent' : value ? c.dark : theme.trackOffEdge;
  const shadeBg = disabled ? theme.disabledBg : trackBg;

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      onPress={() => onValueChange(!value)}
      style={styles.wrap}
    >
      <View style={{ borderRadius: 12, backgroundColor: edgeBg, paddingBottom: disabled ? 0 : EDGE, marginBottom: disabled ? EDGE : 0 }}>
        <Animated.View style={{ width: w, height: h, borderRadius: 12, backgroundColor: trackBg, justifyContent: 'center' }}>
          <Animated.View
            style={{
              width: m,
              height: m,
              borderRadius: m / 2,
              backgroundColor: moonBg,
              overflow: 'hidden',
              marginLeft: PAD,
              transform: [{ translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, travel] }) }],
            }}
          >
            <Animated.View
              style={{
                width: m,
                height: m,
                borderRadius: m / 2,
                backgroundColor: shadeBg,
                transform: [{ translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, m] }) }],
              }}
            />
          </Animated.View>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'flex-start' },
});
