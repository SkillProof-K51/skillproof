import { colors, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Text } from "./Text";

const MARK = 32; // the mark's box; its 64-unit drawing (docs/brand/mark.svg) scales into it

/**
 * The SkillProof logo (direction 3, Azim 29 Oct): a tick between two code brackets, then
 * "skillproof" in the code font. The app icon, splash and the master SVGs: docs/brand.
 */
export function Logo() {
  return (
    <View style={styles.row} accessible accessibilityRole="image" accessibilityLabel="SkillProof">
      <Svg width={MARK} height={MARK} viewBox="0 0 64 64" fill="none">
        <Path
          d="M18 18L6 32L18 46M46 18L58 32L46 46"
          stroke={colors.text.primary}
          strokeWidth={5.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path d="M23.5 32.5L29.5 38.5L41 25.5" stroke={colors.accent.brand} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <Text variant="wordmark">skillproof</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.sm },
});
