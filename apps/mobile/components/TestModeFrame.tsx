import { colors, space, type } from "@skillproof/tokens";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaInsetsContext, useSafeAreaInsets } from "react-native-safe-area-context";

import { isTestMode } from "../lib/testMode";
import { Text } from "./ui";

const STRIP = type.captionStrong.lineHeight + 2 * space.xxs; // one line, tight

/**
 * AGENTS.md rule 4: demo data is never shown without a visible label. In TEST MODE a thin butter
 * strip sits under the status bar on every screen. It adds its height to the safe-area top inset,
 * so heroes, toasts and sheets move down by themselves — no screen has to know it exists
 * (Azim's pick, 18 Oct: out of the design's way, like Expo's own dev banner).
 */
export function TestModeFrame({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  if (!isTestMode) return <>{children}</>;
  return (
    <SafeAreaInsetsContext.Provider value={{ ...insets, top: insets.top + STRIP }}>
      {children}
      <View style={[styles.strip, { top: insets.top }]} pointerEvents="none" accessibilityLabel="Test mode: demo data">
        <Text variant="captionStrong" align="center">
          TEST MODE · demo data
        </Text>
      </View>
    </SafeAreaInsetsContext.Provider>
  );
}

const styles = StyleSheet.create({
  strip: { position: "absolute", left: 0, right: 0, height: STRIP, backgroundColor: colors.accent.butter, justifyContent: "center", zIndex: 2 },
});
