import { colors } from "@skillproof/tokens";
import { Pressable, StyleSheet, View } from "react-native";

import { Icon } from "./Icon";
import { Text } from "./Text";

type Props = {
  title: string;
  /** Trailing link, e.g. "See all". */
  link?: string;
  onPressLink?: () => void;
};

/** Small-caps section label with an optional trailing link. */
export function SectionHeader({ title, link, onPressLink }: Props) {
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
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", alignSelf: "stretch" },
  link: { flexDirection: "row", alignItems: "center", gap: 2 },
});
