import { useEffect, useRef } from 'react';
import { Animated, View, type DimensionValue } from 'react-native';
import { useTheme } from './theme';
import { useReduceMotion } from './useReduceMotion';

export type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  shape?: 'rect' | 'circle';
  /** Diâmetro, quando `shape="circle"`. */
  size?: number;
  radius?: number;
};

function useBeat() {
  const reduce = useReduceMotion();
  const o = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (reduce) {
      o.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(o, { toValue: 0.55, duration: 800, useNativeDriver: true }),
        Animated.timing(o, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduce, o]);
  return o;
}

function SkeletonRoot({ width = '100%', height = 16, shape = 'rect', size = 48, radius = 10 }: SkeletonProps) {
  const theme = useTheme();
  const o = useBeat();
  const circle = shape === 'circle';
  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        width: circle ? size : width,
        height: circle ? size : height,
        borderRadius: circle ? size / 2 : radius,
        backgroundColor: theme.trackOff,
        opacity: o,
      }}
    />
  );
}

function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <View accessible style={{ gap: 10 }} accessibilityLabel="Carregando" accessibilityRole="progressbar">
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonRoot key={i} height={14} width={i === lines - 1 && lines > 1 ? '60%' : '100%'} />
      ))}
    </View>
  );
}

export const Skeleton = Object.assign(SkeletonRoot, { Text: SkeletonText });
