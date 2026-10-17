import { colors, space } from "@skillproof/tokens";
import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View, type ViewStyle } from "react-native";

type Props = {
  children: ReactNode;
  /** Extra style for the scroll content (default: 24 px bottom padding). */
  contentStyle?: ViewStyle;
};

/**
 * Page shell: the app background gradient (appTop → app) and a vertical scroll.
 * Safe-area insets are handled by the screens' own hero (top) and the tab bar (bottom).
 */
export function Screen({ children, contentStyle }: Props) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.bg.appTop, colors.bg.appTop, colors.bg.app]}
        locations={[0, 0.3, 0.8]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        contentContainerStyle={[styles.content, contentStyle]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg.app },
  content: { paddingBottom: space.xl },
});
