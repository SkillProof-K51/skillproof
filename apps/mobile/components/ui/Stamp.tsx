import { colors, motion, radius, space } from "@skillproof/tokens";
import { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet } from "react-native";

import { NATIVE_DRIVER, useDuration } from "./motion";
import type { SkillStatus } from "./StatusBadge";
import { Text } from "./Text";

const BORDER = 3;
const ROTATE = "-8deg"; // slapped on, not printed
const SLAM_FROM = 1.8; // a slammed stamp starts this big and lands at its own size
const SLAM_OVERSHOOT = 2; // Easing.back strength: it lands a touch small, then settles — the thud

type Status = Exclude<SkillStatus, "not_yet">;
const LABELS: Record<Status, string> = { practised: "Practised", verified: "Verified" };

type Props = {
  /** practised (blue, Module 3's result) or verified (green, Module 4's). Colour = meaning. */
  status: Status;
  /** Override the word, e.g. "Passed". Keep it to one or two words. */
  label?: string;
  /**
   * Slam it down when it appears — the one motion moment of a Result's celebration. It waits a
   * beat (motion.standard) so the eye finds the mascot first. Lands at rest under Reduce Motion.
   */
  slam?: boolean;
};

/** The rubber stamp on a Result screen's celebration beat: PRACTISED or VERIFIED, slightly rotated. */
export function Stamp({ status, label, slam }: Props) {
  const tone = colors.status[status];
  const word = label ?? LABELS[status];
  const duration = useDuration("standard");
  const [land] = useState(() => new Animated.Value(slam ? 0 : 1));

  useEffect(() => {
    if (!slam) return;
    if (!duration) {
      land.setValue(1);
      return;
    }
    land.setValue(0);
    const anim = Animated.sequence([
      Animated.delay(motion.standard),
      Animated.timing(land, { toValue: 1, duration, easing: Easing.out(Easing.back(SLAM_OVERSHOOT)), useNativeDriver: NATIVE_DRIVER }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [slam, duration, land]);

  const scale = land.interpolate({ inputRange: [0, 1], outputRange: [SLAM_FROM, 1] });
  const opacity = land.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1, 1] });

  return (
    <Animated.View
      style={[styles.stamp, { borderColor: tone.fg, backgroundColor: tone.bg, opacity, transform: [{ rotate: ROTATE }, { scale }] }]}
      accessibilityRole="image"
      accessibilityLabel={`${word} stamp`}
    >
      <Text variant="stamp" color={tone.fg}>
        {word}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stamp: {
    alignSelf: "center",
    paddingHorizontal: space.lg,
    paddingVertical: space.xs,
    borderWidth: BORDER,
    borderRadius: radius.control,
  },
});
