import { useEffect, useState, type ReactNode } from "react";
import { Animated, Easing, type ViewStyle } from "react-native";

import { NATIVE_DRIVER, useDuration } from "./motion";

const RISE = 16; // it comes up from this far below

type Props = { children: ReactNode; style?: ViewStyle };

/**
 * Fades its content in and lifts it into place when it appears — the move from one onboarding
 * step to the next (give it a new `key` per step). At rest straight away under Reduce Motion.
 */
export function Reveal({ children, style }: Props) {
  const duration = useDuration("standard");
  const [t] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!duration) {
      t.setValue(1);
      return;
    }
    const anim = Animated.timing(t, { toValue: 1, duration, easing: Easing.out(Easing.cubic), useNativeDriver: NATIVE_DRIVER });
    anim.start();
    return () => anim.stop();
  }, [duration, t]);

  const rise = t.interpolate({ inputRange: [0, 1], outputRange: [RISE, 0] });
  return <Animated.View style={[style, { opacity: t, transform: [{ translateY: rise }] }]}>{children}</Animated.View>;
}
