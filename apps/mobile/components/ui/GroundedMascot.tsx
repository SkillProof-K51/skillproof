import { motion } from "@skillproof/tokens";
import { useEffect, useState } from "react";
import { Animated, Easing, View, type StyleProp, type ViewStyle } from "react-native";

import { Mascot, mascotSize, type MascotPose } from "./Mascot";
import { MascotShadow } from "./MascotShadow";
import { NATIVE_DRIVER, useReducedMotion } from "./motion";

const SHADOW_RATIO = 0.62; // shadow width ≈ 62 % of the mascot
const SHADOW_TUCK = 9; // the shadow's top sits 9 px above the mascot's feet
const BOB = 3; // the idle bob: this many px up and back, one breath per motion.breath
const SHADOW_SHRINK = 0.92; // the shadow narrows as the mascot rises

type Props = {
  pose: MascotPose;
  width?: number;
  /** The idle bob. Off under Reduce Motion regardless. */
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * A mascot standing on its soft ground shadow, breathing: a slow bob with the shadow narrowing as
 * it rises. Used by <Hero>, <SectionHeader>, <Dialog>, <EmptyState> — anywhere the mascot stands.
 */
export function GroundedMascot({ pose, width, animate = true, style }: Props) {
  const m = mascotSize(pose, width);
  const shadowWidth = Math.round(m.width * SHADOW_RATIO);
  const [rise] = useState(() => new Animated.Value(0));
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !animate) {
      rise.setValue(0);
      return;
    }
    const half = motion.breath / 2;
    const ease = Easing.inOut(Easing.sin);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(rise, { toValue: 1, duration: half, easing: ease, useNativeDriver: NATIVE_DRIVER }),
        Animated.timing(rise, { toValue: 0, duration: half, easing: ease, useNativeDriver: NATIVE_DRIVER }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [rise, reduced, animate]);

  const translateY = rise.interpolate({ inputRange: [0, 1], outputRange: [0, -BOB] });
  const scaleX = rise.interpolate({ inputRange: [0, 1], outputRange: [1, SHADOW_SHRINK] });

  return (
    <View style={[{ width: m.width, height: m.height }, style]} pointerEvents="none">
      {/* shadow first so it sits behind the feet */}
      <Animated.View style={{ position: "absolute", left: (m.width - shadowWidth) / 2, top: m.height - SHADOW_TUCK, transform: [{ scaleX }] }}>
        <MascotShadow width={shadowWidth} />
      </Animated.View>
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Mascot pose={pose} width={m.width} />
      </Animated.View>
    </View>
  );
}
