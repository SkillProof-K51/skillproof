import { colors, layout, radius } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

type Props = {
  /** tall (290) = Home / Welcome / a module's first screen · compact (180) = sub-screens, auth, lists. */
  size?: "tall" | "compact";
  /** Any other height (the Hero passes its real height). The lip stays pinned to the bottom. */
  height?: number;
};

/**
 * Screen-top sky: a plain gradient (clouds removed, Azim 18 Oct) and the sheet lip in bg/app — the
 * same flat colour <Screen> paints behind the content, so the lip reads as the top edge of the page.
 * Put it first inside a hero View of the same height. Content below overlaps the lip by 24.
 */
export function SkyBackdrop({ size = "tall", height }: Props) {
  const h = height ?? (size === "tall" ? layout.heroTall : layout.heroCompact);
  return (
    <View style={[StyleSheet.absoluteFill, { height: h }]} pointerEvents="none">
      <Svg width="100%" height={h} viewBox={`0 0 ${layout.designWidth} ${h}`} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0" stopColor={colors.sky.top} />
            <Stop offset="0.62" stopColor={colors.sky.mid} />
            <Stop offset="1" stopColor={colors.sky.bottom} />
          </LinearGradient>
        </Defs>
        <Rect width={layout.designWidth} height={h} fill="url(#sky)" />
      </Svg>
      <View style={styles.lip} />
    </View>
  );
}

const styles = StyleSheet.create({
  lip: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: layout.skyLip,
    backgroundColor: colors.bg.app,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
  },
});
