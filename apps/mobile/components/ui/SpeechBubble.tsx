import { colors, radius, shadow } from "@skillproof/tokens";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Text } from "./Text";

// Figma "Speech bubble" component (178 × 56 on Home)
const PAD_X = 14;
const PAD_Y = 10;
const TEXT_WIDTH = 150; // wraps the ~40-character line onto two lines
const TAIL = 12; // square rotated 45°, half of it sticks out on the right
const TAIL_RADIUS = 2;

type Props = {
  /** One short line, max ~40 characters. */
  text: string;
  style?: StyleProp<ViewStyle>;
};

/** Mascot speech bubble, tail on the right (the mascot stands to the right of it). */
export function SpeechBubble({ text, style }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.bubble}>
        <Text variant="small" style={styles.text}>
          {text}
        </Text>
      </View>
      <View style={styles.tail} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: "flex-start" },
  bubble: {
    backgroundColor: colors.bg.surface,
    borderRadius: radius.xl,
    paddingHorizontal: PAD_X,
    paddingVertical: PAD_Y,
    shadowColor: shadow.bubble.color,
    shadowOpacity: shadow.bubble.opacity,
    shadowOffset: { width: 0, height: shadow.bubble.offsetY },
    shadowRadius: shadow.bubble.blur / 2,
    elevation: 3,
  },
  text: { width: TEXT_WIDTH },
  tail: {
    position: "absolute",
    right: -(TAIL / 2 - 1),
    top: "50%",
    marginTop: -TAIL / 2,
    width: TAIL,
    height: TAIL,
    backgroundColor: colors.bg.surface,
    transform: [{ rotate: "45deg" }],
    borderRadius: TAIL_RADIUS,
  },
});
