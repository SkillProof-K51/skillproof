import { colors, opacity, space } from "@skillproof/tokens";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Icon } from "./Icon";
import { Text } from "./Text";

const MIN_HEIGHT = 48; // a comfortable touch target, even for one line

type Props = {
  title: string;
  /** A quieter second line. */
  subtitle?: string;
  /** In front: an IconBadge, Avatar or SkillLogo. */
  leading?: ReactNode;
  /** At the end: a StatusBadge, Chip or short text. A tappable row without one gets a chevron. */
  trailing?: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/**
 * One row of a list — skills, challenges, applications, settings. Put rows inside a <Card> with a
 * <Divider> between them. Tappable rows (onPress) get a chevron unless they bring their own trailing.
 */
export function ListRow({ title, subtitle, leading, trailing, onPress, accessibilityLabel }: Props) {
  const content = (
    <>
      {leading}
      <View style={styles.text}>
        <Text variant="subheading">{title}</Text>
        {subtitle ? (
          <Text variant="small" color="secondary">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing ?? (onPress ? <Icon name="chevron-right" size={20} color={colors.icon.default} /> : null)}
    </>
  );
  if (!onPress) {
    return (
      <View style={styles.row} accessibilityLabel={accessibilityLabel}>
        {content}
      </View>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (subtitle ? `${title}. ${subtitle}` : title)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.md, minHeight: MIN_HEIGHT, paddingVertical: space.md },
  text: { flex: 1, gap: space.xxs },
  pressed: { opacity: opacity.pressed },
});
