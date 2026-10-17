import { colors, radius } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { Text } from "./Text";

type Props = {
  initials: string;
  size?: number;
  /** sky = on white cards (default) · surface = white circle, for avatars sitting on the sky. */
  tone?: "sky" | "surface";
};

/** Initials in a circle. Photos come later with the shared core. */
export function Avatar({ initials, size = 44, tone = "sky" }: Props) {
  return (
    <View
      style={[styles.circle, tone === "surface" ? styles.surface : styles.sky, { width: size, height: size }]}
      accessibilityLabel={`Avatar ${initials}`}
    >
      <Text variant="bodyStrong">{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  sky: { backgroundColor: colors.accent.sky },
  surface: { backgroundColor: colors.bg.surface },
});
