import { colors, layout, space } from "@skillproof/tokens";
import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View, type ViewStyle } from "react-native";

type Props = {
  children: ReactNode;
  /** Extra style for the scroll content (default: 24 px bottom padding). */
  contentStyle?: ViewStyle;
};

/**
 * Page shell: a vertical scroll whose background is bg/app-top at the top, fading to bg/app.
 * The gradient scrolls WITH the content (as in the Figma frames), so the sky's lip always sits
 * on exactly the colour it is painted in. Safe-area insets are handled by the screen's own hero
 * (top) and the tab bar (bottom).
 */
export function Screen({ children, contentStyle }: Props) {
  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.content, contentStyle]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
      >
        <LinearGradient
          colors={[colors.bg.appTop, colors.bg.appTop, colors.bg.app]}
          locations={[0, layout.pageFadeStart / layout.pageFadeEnd, 1]}
          style={styles.pageBackground}
          pointerEvents="none"
        />
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg.app },
  content: { paddingBottom: space.xl },
  pageBackground: { position: "absolute", top: 0, left: 0, right: 0, height: layout.pageFadeEnd },
});
