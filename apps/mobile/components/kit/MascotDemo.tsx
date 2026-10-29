import { colors, radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { Logo, Mascot, SpeechBubble, Text } from "../ui";
import { KitLabel, KitSection } from "./KitSection";

const SMALL = 48;
const LARGE = 96;

/** The mascot (Gem at three sizes, then saying something, as on Home) and the logo. */
export function MascotDemo() {
  return (
    <KitSection title="Mascot & logo" components="Mascot · SpeechBubble · Logo">
      <KitLabel>Mascot · Gem, a skill badge come alive; it floats (still under Reduce Motion) and screen readers skip it</KitLabel>
      <View style={styles.row}>
        <Mascot size={SMALL} />
        <Mascot />
        <Mascot size={LARGE} />
      </View>
      <KitLabel>SpeechBubble · what Gem says, the tail pointing back at it — the words come from lib/</KitLabel>
      {/* on the page colour, as on Home — a white bubble vanishes on a white card */}
      <View style={[styles.row, styles.page]}>
        <Mascot />
        <SpeechBubble style={styles.bubble}>
          <Text variant="heading">Good morning, Aina!</Text>
          <Text variant="small" color="secondary">
            12% more and you’re ready for Web Developer roles.
          </Text>
        </SpeechBubble>
      </View>
      <KitLabel>{'Logo · on the page, and tone="onBrand" on the purple (the launch screen Welcome opens from)'}</KitLabel>
      <Logo />
      <View style={styles.brand}>
        <Logo tone="onBrand" />
      </View>
    </KitSection>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.sm },
  page: { padding: space.md, borderRadius: radius.xl, backgroundColor: colors.bg.app },
  bubble: { flex: 1 },
  brand: { alignItems: "center", paddingVertical: space.xl, borderRadius: radius.xl, backgroundColor: colors.accent.brand },
});
