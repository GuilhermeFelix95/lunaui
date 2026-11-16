import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { deriveColor } from './color';
import { useTheme } from './theme';

export type CheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  accessibilityLabel?: string;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: boolean;
  color?: string;
};

const SIZES = { sm: 20, md: 26, lg: 32 } as const;
const EDGE = 3;
const BORDER = 2;

export function Checkbox({
  checked,
  onCheckedChange,
  label,
  accessibilityLabel,
  indeterminate = false,
  size = 'md',
  disabled = false,
  error = false,
  color,
}: CheckboxProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const s = SIZES[size];
  const radius = Math.round(s * 0.35);
  const on = checked || indeterminate;
  const mark = useRef(new Animated.Value(on ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(mark, { toValue: on ? 1 : 0, duration: 220, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
  }, [on, mark]);

  const fill = disabled ? theme.disabledBg : on ? c.base : theme.fieldBg;
  const line = disabled ? 'transparent' : on ? c.base : error ? theme.error : theme.boxLine;
  const fg = disabled ? theme.disabledFg : c.on;
  const inner = s - BORDER * 2;
  const tickW = Math.round(s * 0.26);
  const tickH = Math.round(s * 0.5);
  const moon = Math.round(s * 0.5);

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ checked: indeterminate ? 'mixed' : checked, disabled }}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      onPress={() => onCheckedChange(!checked)}
      style={({ pressed }) => [styles.row, { minHeight: 44 }, pressed && on && { opacity: 0.9 }]}
    >
      {({ pressed }) => (
        <>
          <View
            style={{
              borderRadius: radius,
              backgroundColor: on && !disabled ? c.dark : 'transparent',
              paddingBottom: on && !disabled ? EDGE : 0,
              marginBottom: on && !disabled ? 0 : EDGE,
            }}
          >
            <View
              style={{
                width: s,
                height: s,
                borderRadius: radius,
                borderWidth: BORDER,
                borderColor: line,
                backgroundColor: fill,
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{ translateY: pressed && on && !disabled ? EDGE - 1 : 0 }],
              }}
            >
              <Animated.View style={{ width: inner, height: inner, alignItems: 'center', justifyContent: 'center', opacity: mark, transform: [{ scale: mark }] }}>
                {indeterminate ? (
                  <View style={{ width: moon / 2, height: moon, overflow: 'hidden', alignSelf: 'center', marginRight: moon / 2 }}>
                    <View style={{ width: moon, height: moon, borderRadius: moon / 2, backgroundColor: fg }} />
                  </View>
                ) : (
                  <View
                    style={{
                      width: tickW,
                      height: tickH,
                      borderRightWidth: 3,
                      borderBottomWidth: 3,
                      borderColor: fg,
                      borderRadius: 1,
                      marginTop: -Math.round(s * 0.08),
                      transform: [{ rotate: '45deg' }],
                    }}
                  />
                )}
              </Animated.View>
            </View>
          </View>
          {label ? <Text style={{ fontSize: 16, color: disabled ? theme.disabledFg : theme.text }}>{label}</Text> : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, alignSelf: 'flex-start' },
});
