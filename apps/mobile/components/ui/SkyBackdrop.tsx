import { colors, layout, radius } from "@skillproof/tokens";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

type Props = {
  /** tall (290) = Home / Welcome / a module's first screen · compact (180) = sub-screens, auth, lists. */
  size?: "tall" | "compact";
  /** Any other height (the Hero passes its real height). The lip stays pinned to the bottom. */
  height?: number;
};

/**
 * Screen-top sky: a painted sky (Azim, 18 Oct), top-aligned so the clear blue sits behind the
 * header and the clouds drift in lower down, plus the sheet lip in bg/app — the same flat colour
 * <Screen> paints behind the content, so the lip reads as the top edge of the page.
 * Put it first inside a hero View of the same height. Content below starts on the sheet, `layout.sheetGap` below the sky's edge.
 */
export function SkyBackdrop({ size = "tall", height }: Props) {
  const h = height ?? (size === "tall" ? layout.heroTall : layout.heroCompact);
  return (
    <View style={[StyleSheet.absoluteFill, styles.base, { height: h }]} pointerEvents="none">
      <Image
        source={require("../../assets/sky.jpg")}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition="top"
        accessible={false}
      />
      <View style={styles.lip} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.sky.base },
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
