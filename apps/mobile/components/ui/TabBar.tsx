import { blur, colors, radius, shadow, space, type } from "@skillproof/tokens";
import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import type { Tabs } from "expo-router";
import { useEffect, useState, type ComponentProps } from "react";
import { AccessibilityInfo, Platform, Pressable, StyleSheet, View } from "react-native";
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
const ICON_ACTIVE = 24; // outline, a touch bigger
const ICON_IDLE = 22; // outline
const ACTIVE = colors.accent.brand; // brand-blue outline icon + label on the soft-sky pill
// dock height above the home indicator: top padding + one tab (padding + icon + gap + label)
const BAR_CONTENT_HEIGHT = space.sm + 2 * space.sm + ICON_ACTIVE + space.xs + type.captionStrong.lineHeight;

/** Height the floating dock covers at the bottom of the screen — <Screen> pads its content by it. */
export function useTabBarHeight(): number {
  const insets = useSafeAreaInsets();
  return BAR_CONTENT_HEIGHT + Math.max(insets.bottom, space.md);
}

/**
 * Bottom navigation (Azim, 18 Oct): a dock that floats over the content, made of glass — real
 * Liquid Glass on iOS 26, a frosted blur elsewhere, solid white when "Reduce Transparency" is on.
 * The active tab sits in a soft-sky pill with a brand-blue outline icon and label.
 */
export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.dock}>
      <View style={styles.clip}>
        <DockMaterial />
      </View>
      <View style={[styles.row, { paddingBottom: Math.max(insets.bottom, space.md) }]}>
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
                  weight="regular"
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
    </View>
  );
}

/** The dock's surface: Liquid Glass → frosted blur → solid white, best available first. */
function DockMaterial() {
  const [reduceTransparency, setReduceTransparency] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceTransparencyEnabled?.()
      .then(setReduceTransparency)
      .catch(() => setReduceTransparency(false));
  }, []);

  if (reduceTransparency) return <View style={[StyleSheet.absoluteFill, styles.solid]} />;
  if (Platform.OS === "ios" && isLiquidGlassAvailable()) {
    return <GlassView style={StyleSheet.absoluteFill} glassEffectStyle="regular" />;
  }
  return (
    <>
      <BlurView style={StyleSheet.absoluteFill} intensity={blur.dock} tint="light" />
      <View style={[StyleSheet.absoluteFill, styles.veil]} />
    </>
  );
}

const styles = StyleSheet.create({
  // floats over the screen so the glass has content behind it
  dock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    boxShadow: shadow.dock,
  },
  clip: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    overflow: "hidden",
  },
  solid: { backgroundColor: colors.bg.surface },
  veil: { backgroundColor: colors.glass.veil },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: BAR_PAD_X,
    paddingTop: space.sm,
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
