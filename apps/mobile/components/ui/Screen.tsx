import { colors, space } from "@skillproof/tokens";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, type ViewStyle } from "react-native";

type Props = {
  children: ReactNode;
  /** Extra style for the scroll content (default: 24 px bottom padding). */
  contentStyle?: ViewStyle;
};

/**
 * Page shell: a vertical scroll on the flat bg/app page colour — the same colour as the sky's
 * lip, so the hero's sheet edge and the page read as one surface. Safe-area insets are handled
 * by the screen's own hero (top) and the tab bar (bottom).
 */
export function Screen({ children, contentStyle }: Props) {
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, contentStyle]}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg.app },
  content: { paddingBottom: space.xl },
});
