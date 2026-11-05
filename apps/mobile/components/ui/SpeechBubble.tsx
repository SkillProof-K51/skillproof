import { colors, radius, space } from "@skillproof/tokens";
import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

const PAD_X = 14;
const PAD_Y = 10;
const TAIL = 12; // a square turned 45°; half of it sticks out on the left
const TAIL_RADIUS = 2;

type Props = {
  /** What the mascot says — usually a heading line and a small one under it. */
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * What the Mascot says: a white bubble with its tail on the left, pointing back at the mascot
 * beside it (on the left, so it never reads like a message the student sent).
 */
export function SpeechBubble({ children, style }: Props) {
  return (
    <View style={style}>
      <View style={styles.tail} />
      <View style={styles.bubble}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: colors.bg.surface,
    borderRadius: radius.xl,
    paddingHorizontal: PAD_X,
    paddingVertical: PAD_Y,
    gap: space.xxs,
  },
  tail: {
    position: "absolute",
    left: -(TAIL / 2 - 1),
    top: "50%",
    marginTop: -TAIL / 2,
    width: TAIL,
    height: TAIL,
    backgroundColor: colors.bg.surface,
    transform: [{ rotate: "45deg" }],
    borderRadius: TAIL_RADIUS,
  },
});
