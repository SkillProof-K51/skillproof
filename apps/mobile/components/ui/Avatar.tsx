import { colors, radius } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { Text } from "./Text";

type Props = { initials: string; size?: number };

/** Initials on a sky circle. Photos come later with the shared core. */
export function Avatar({ initials, size = 44 }: Props) {
  return (
    <View style={[styles.circle, { width: size, height: size }]} accessibilityLabel={`Avatar ${initials}`}>
      <Text variant="bodyStrong">{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: radius.full,
    backgroundColor: colors.accent.sky,
    alignItems: "center",
    justifyContent: "center",
  },
});
