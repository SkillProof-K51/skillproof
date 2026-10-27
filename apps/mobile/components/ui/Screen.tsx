import { colors, layout, space } from "@skillproof/tokens";
import { useId, useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, View, type LayoutChangeEvent, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { useTabBarHeight } from "./TabBar";

const TINT_FADE = 0.6; // a tint has melted into the page colour this far down the screen

type Props = {
  children: ReactNode;
  /** Extra style for the scroll content. */
  contentStyle?: ViewStyle;
  /**
   * The floating glass dock covers the bottom of tab screens; pad the content so the last card
   * scrolls clear of it. Turn off for screens without the tab bar (e.g. a challenge in progress).
   */
  aboveTabBar?: boolean;
  /**
   * A soft wash of colour at the top that fades into the page colour (BitePal's detail pages, Azim
   * 25 Oct). It stays put while the content scrolls. A challenge's page passes its kind's pastel.
   */
  tint?: string;
  /** Pinned under the scroll, above the home indicator: the screen's main action (Start challenge). */
  footer?: ReactNode;
};

/**
 * Page shell: a vertical scroll on the flat bg/app page colour, or a tint fading into it. Safe-area
 * insets are handled by the screen's own hero (top) and the tab bar or the footer (bottom).
 */
export function Screen({ children, contentStyle, aboveTabBar = true, tint, footer }: Props) {
  const tabBar = useTabBarHeight();
  const insets = useSafeAreaInsets();
  const layered = !!(tint || footer);
  const scroll = (
    <ScrollView
      style={layered ? styles.flex : styles.root}
      contentContainerStyle={[{ paddingBottom: (aboveTabBar ? tabBar : 0) + space.xl }, contentStyle]}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
      // forms: a tap on a button lands even while the keyboard is up, and iOS scrolls the focused
      // field clear of the keyboard (Android resizes the window by itself)
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      {children}
    </ScrollView>
  );
  if (!layered) return scroll;
  return (
    <View style={styles.root}>
      {tint ? <Wash colour={tint} /> : null}
      {scroll}
      {footer ? <View style={[styles.footer, { paddingBottom: insets.bottom + space.lg }]}>{footer}</View> : null}
    </View>
  );
}

/** The tint, fading down into the page colour. Drawn at the measured size: percentage sizes don't fill on the web. */
function Wash({ colour }: { colour: string }) {
  const id = `wash${useId().replace(/[^a-zA-Z0-9]/g, "")}`; // url() rejects ":"
  const [size, setSize] = useState({ width: 0, height: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((s) => (s.width === width && s.height === height ? s : { width, height }));
  };
  return (
    <View style={StyleSheet.absoluteFill} onLayout={onLayout} pointerEvents="none">
      <Svg width={size.width} height={size.height}>
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colour} />
            <Stop offset={TINT_FADE} stopColor={colors.bg.app} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={size.width} height={size.height} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg.app },
  flex: { flex: 1 },
  footer: { paddingHorizontal: layout.gutter, paddingTop: space.md },
});
