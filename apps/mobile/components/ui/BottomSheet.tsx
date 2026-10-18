import { colors, layout, radius, space } from "@skillproof/tokens";
import type { ReactNode } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Overlay } from "./Overlay";
import { Text } from "./Text";

const SLIDE = 120; // the sheet rises this far as it fades in
const GRABBER = { width: 36, height: 4 };
const MAX_HEIGHT = "85%"; // of the window; longer content scrolls inside

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

/**
 * A sheet that slides up from the bottom: options, filters, a short form. Scrim tap, back gesture
 * or your own Close button dismisses it. Keep the content short; long lists scroll inside.
 */
export function BottomSheet({ visible, onClose, title, children }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Overlay visible={visible} onClose={onClose} align="bottom">
      {(progress) => (
        <Animated.View
          style={[
            styles.sheet,
            { paddingBottom: insets.bottom + space.xl, opacity: progress, transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [SLIDE, 0] }) }] },
          ]}
          accessibilityViewIsModal
        >
          <View style={styles.grabber} />
          {title ? (
            <Text variant="heading" accessibilityRole="header">
              {title}
            </Text>
          ) : null}
          <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {children}
          </ScrollView>
        </Animated.View>
      )}
    </Overlay>
  );
}

const styles = StyleSheet.create({
  sheet: {
    maxHeight: MAX_HEIGHT,
    backgroundColor: colors.bg.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingHorizontal: layout.gutter,
    paddingTop: space.md,
    gap: space.lg,
  },
  grabber: { width: GRABBER.width, height: GRABBER.height, borderRadius: radius.full, backgroundColor: colors.border.default, alignSelf: "center" },
  content: { gap: space.sm },
});
