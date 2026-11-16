import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** `true` quando o sistema pede para reduzir movimento. */
export function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce).catch(() => {});
  }, []);
  return reduce;
}
