import { motion } from "@skillproof/tokens";
import { useEffect, useState } from "react";
import { AccessibilityInfo, Platform } from "react-native";

/** Animated's native driver: not on the web (react-native-web animates in JS and warns otherwise). */
export const NATIVE_DRIVER = Platform.OS !== "web";

/** True when the phone's Reduce Motion setting is on — animations then run with duration 0. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let live = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => live && setReduced(v))
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduced);
    return () => {
      live = false;
      sub.remove();
    };
  }, []);
  return reduced;
}

/** A motion token's duration, or 0 under Reduce Motion. */
export function useDuration(key: keyof typeof motion): number {
  return useReducedMotion() ? 0 : motion[key];
}
