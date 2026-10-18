import { colors, space } from "@skillproof/tokens";
import { Pressable, StyleSheet, View } from "react-native";

import { GroundedMascot } from "./GroundedMascot";
import { Icon } from "./Icon";
import type { MascotPose } from "./Mascot";
import { Text } from "./Text";

const MASCOT_WIDTH = 96; // the mascot standing on the sheet edge, at the header's right end

type Props = { title: string } & (
  | {
      /** Trailing link, e.g. "See all". */
      link?: string;
      onPressLink?: () => void;
      mascot?: never;
    }
  | {
      /**
       * A mascot standing at the right end of the header, peeking up over it — for the first
       * section under a Hero, as the screen's one mascot (docs/ui.md). Not together with a link.
       */
      mascot: MascotPose;
      link?: never;
      onPressLink?: never;
    }
);

/** Small-caps section label with an optional trailing link, or a mascot standing at its right end. */
export function SectionHeader({ title, link, onPressLink, mascot }: Props) {
  return (
    <View style={styles.row}>
      <Text variant="sectionLabel" color="secondary">
        {title}
      </Text>
      {link ? (
        <Pressable onPress={onPressLink} accessibilityRole="link" hitSlop={8} style={styles.link}>
          <Text variant="captionStrong">{link}</Text>
          <Icon name="chevron-right" size={16} color={colors.text.primary} />
        </Pressable>
      ) : null}
      {/* feet on the header's baseline; the body rises over the sheet edge into the sky */}
      {mascot ? <GroundedMascot pose={mascot} width={MASCOT_WIDTH} style={styles.mascot} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", alignSelf: "stretch" },
  link: { flexDirection: "row", alignItems: "center", gap: space.xxs },
  mascot: { position: "absolute", right: 0, bottom: 0 },
});
