import { colors, space } from "@skillproof/tokens";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, type ViewStyle } from "react-native";

import { useTabBarHeight } from "./TabBar";

type Props = {
  children: ReactNode;
  /** Extra style for the scroll content. */
  contentStyle?: ViewStyle;
  /**
   * The floating glass dock covers the bottom of tab screens; pad the content so the last card
   * scrolls clear of it. Turn off for screens without the tab bar (e.g. a challenge in progress).
   */
  aboveTabBar?: boolean;
};

/**
 * Page shell: a vertical scroll on the flat bg/app page colour — the same colour as the sky's
 * lip, so the hero's sheet edge and the page read as one surface. Safe-area insets are handled
 * by the screen's own hero (top) and the tab bar (bottom).
 */
export function Screen({ children, contentStyle, aboveTabBar = true }: Props) {
  const tabBar = useTabBarHeight();
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[{ paddingBottom: (aboveTabBar ? tabBar : 0) + space.xl }, contentStyle]}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg.app },
});
