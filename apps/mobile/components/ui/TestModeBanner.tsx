import { colors, radius } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { isTestMode } from "../../lib/testMode";
import { Text } from "./Text";

/** AGENTS.md rule 4: demo data and mocked AI are only ever shown behind this visible label. */
export function TestModeBanner() {
  const insets = useSafeAreaInsets();
  if (!isTestMode) return null;
  return (
    <View style={[styles.pill, { top: insets.top + 4 }]} pointerEvents="none" accessibilityLabel="Test mode">
      <Text variant="captionStrong">TEST MODE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: "absolute",
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.accent.butter,
  },
});
