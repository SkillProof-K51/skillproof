import { colors, radius, shadow } from "@skillproof/tokens";
import { StyleSheet, View, type ViewStyle } from "react-native";

import { Text } from "./Text";

type Props = {
  /** One short line, max ~40 characters. */
  text: string;
  style?: ViewStyle;
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: shadow.bubble.color,
    shadowOpacity: shadow.bubble.opacity,
    shadowOffset: { width: 0, height: shadow.bubble.offsetY },
    shadowRadius: shadow.bubble.blur / 2,
    elevation: 3,
  },
  text: { width: 150 },
  tail: {
    position: "absolute",
    right: -5,
    top: "50%",
    marginTop: -6,
    width: 12,
    height: 12,
    backgroundColor: colors.bg.surface,
    transform: [{ rotate: "45deg" }],
    borderRadius: 2,
  },
});
