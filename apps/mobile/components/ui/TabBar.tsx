import { colors, radius, shadow, space } from "@skillproof/tokens";
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

const BAR_PAD_X = 14;
const ITEM_WIDTH = 70; // 5 items fit a 390 screen with the bar padding
const ICON_ACTIVE = 24; // Fill
const ICON_IDLE = 22; // Regular
const ACTIVE = colors.accent.brand; // filled brand-blue icon + label on the soft-sky pill

/**
 * Bottom navigation, "pill highlight" on a white dock (Azim, 18 Oct): the active tab sits in a
 * soft-sky pill with a filled brand-blue icon and label; the others are a Regular icon + Regular
 * label. The dock has the same rounded top as the sky's lip and casts a faint shadow upwards.
 */
export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, space.md) }]}>
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
            style={[styles.item, focused && styles.itemActive]}
          >
            <View style={styles.slot}>
              <Icon
                name={TAB_ICONS[route.name] ?? "compass"}
                size={focused ? ICON_ACTIVE : ICON_IDLE}
                weight={focused ? "fill" : "regular"}
                color={focused ? ACTIVE : colors.icon.default}
              />
            </View>
            <Text variant={focused ? "captionStrong" : "caption"} color={focused ? ACTIVE : "secondary"}>
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
    paddingHorizontal: BAR_PAD_X,
    paddingTop: space.sm,
    backgroundColor: colors.bg.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    boxShadow: shadow.dock,
  },
  // the pill: the whole tab is the touch target, so it's big and easy to hit
  item: {
    width: ITEM_WIDTH,
    alignItems: "center",
    gap: space.xs,
    paddingVertical: space.sm,
    borderRadius: radius.lg,
  },
  itemActive: { backgroundColor: colors.accent.skySoft },
  slot: { height: ICON_ACTIVE, justifyContent: "center" },
});
