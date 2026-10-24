import { blur, colors, radius, shadow, space } from "@skillproof/tokens";
import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import type { Tabs } from "expo-router";
import { useEffect, useState, type ComponentProps } from "react";
import { AccessibilityInfo, Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon, type IconName } from "./Icon";

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

const PILL_HEIGHT = 62; // BitePal's floating tab pill
const ITEM = 48; // round touch target per tab
const ICON = 24;

/** Height the floating pill covers at the bottom of the screen — <Screen> pads its content by it. */
export function useTabBarHeight(): number {
  const insets = useSafeAreaInsets();
  return PILL_HEIGHT + Math.max(insets.bottom, space.md) + space.sm;
}

/**
 * Bottom navigation (BitePal-style, Azim 24 Oct): a soft grey pill floating over the content,
 * icons only — the active one dark and filled, the rest grey. Each tab keeps its name as the
 * accessibility label. The material is Liquid Glass on iOS 26, a frosted blur elsewhere, solid
 * when "Reduce Transparency" is on.
 */
export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[styles.dock, { paddingBottom: Math.max(insets.bottom, space.md) }]}>
      <View style={styles.pill}>
        <View style={styles.clip}>
          <DockMaterial />
        </View>
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
              style={styles.item}
            >
              <Icon
                name={TAB_ICONS[route.name] ?? "compass"}
                size={ICON}
                weight={focused ? "fill" : "bold"}
                color={focused ? colors.text.primary : colors.icon.muted}
              />
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
  // a row across the bottom that only holds the centred pill; touches pass through around it
  dock: { position: "absolute", left: 0, right: 0, bottom: 0, alignItems: "center" },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    height: PILL_HEIGHT,
    paddingHorizontal: space.sm,
    gap: space.xs,
    borderRadius: radius.full,
    boxShadow: shadow.dock,
  },
  clip: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, borderRadius: radius.full, overflow: "hidden" },
  solid: { backgroundColor: colors.bg.surface },
  veil: { backgroundColor: colors.glass.veil },
  item: { width: ITEM, height: ITEM, alignItems: "center", justifyContent: "center" },
});
