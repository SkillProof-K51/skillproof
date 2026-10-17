import { colors } from "@skillproof/tokens";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Ellipse } from "react-native-svg";

type Props = {
  /** ≈ 62 % of the mascot's width (Figma note). */
  width: number;
  style?: ViewStyle;
};

/**
 * Soft ground shadow under a mascot. Figma: 88×14 ellipse, slate 16 %, 3 px blur.
 * Drawn as three stacked ellipses (≈ 16 % at the core, fading at the rim) so it renders the
 * same on native and web without gradient defs.
 */
export function MascotShadow({ width, style }: Props) {
  const height = Math.round((width * 14) / 88);
  return (
    <View style={[{ width, height }, style]} pointerEvents="none">
      {/* The blur spills past the box, so the drawing is larger than the layout box. */}
      <Svg style={styles.svg} viewBox="0 0 100 26" preserveAspectRatio="none">
        <Ellipse cx={50} cy={13} rx={50} ry={13} fill={colors.text.primary} opacity={0.04} />
        <Ellipse cx={50} cy={13} rx={47} ry={10.5} fill={colors.text.primary} opacity={0.05} />
        <Ellipse cx={50} cy={13} rx={44} ry={7.5} fill={colors.text.primary} opacity={0.08} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  svg: {
    position: "absolute",
    left: "-6.82%",
    top: "-42.86%",
    width: "113.64%",
    height: "185.72%",
  },
});
