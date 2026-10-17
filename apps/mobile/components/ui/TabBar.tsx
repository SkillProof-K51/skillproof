import { colors } from "@skillproof/tokens";
import type { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";

// Exactly what expo-router's <Tabs tabBar={…}> passes — derived from Tabs so the type can never
// drift from the @react-navigation version expo-router bundles.
type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>["tabBar"]>>[0];

// One tab per module: Home · Challenges (M3) · Projects (M4) · Passport (M5) · Profile (M2).
const TAB_ICONS: Record<string, IconName> = {
  index: "home",
  challenges: "zap",
  projects: "briefcase",
  passport: "id-card",
  profile: "user",
};

/** Flat bottom navigation: no surface, no border, no indicator. Active = Duotone glyph + Medium label. */
export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label = typeof options.title === "string" ? options.title : route.name;
        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
            onPress={onPress}
            hitSlop={8}
            style={styles.item}
          >
            <View style={styles.slot}>
              <Icon
                name={TAB_ICONS[route.name] ?? "compass"}
                size={focused ? 24 : 22}
                weight={focused ? "duotone" : "regular"}
                color={focused ? colors.text.primary : colors.icon.default}
              />
            </View>
            <Text variant={focused ? "captionStrong" : "caption"} color={focused ? "primary" : "secondary"}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: colors.bg.app,
  },
  item: { width: 70, alignItems: "center", gap: 4 },
  slot: { height: 24, justifyContent: "center" },
});
