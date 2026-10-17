import { colors } from "@skillproof/tokens";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Defs, Ellipse, RadialGradient, Stop } from "react-native-svg";

type Props = {
  /** ≈ 62 % of the mascot's width (Figma note). */
  width: number;
  style?: ViewStyle;
};

/** Soft ground shadow under a mascot. Figma: 88×14 ellipse, slate 16 %, 3 px blur. */
export function MascotShadow({ width, style }: Props) {
  const height = Math.round((width * 14) / 88);
  return (
    <View style={[{ width, height }, style]} pointerEvents="none">
      {/* The blur spills past the box, so the drawing is larger than the layout box. */}
      <Svg style={styles.svg} viewBox="0 0 100 26" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id="shadow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor={colors.text.primary} stopOpacity={0.16} />
            <Stop offset="0.7" stopColor={colors.text.primary} stopOpacity={0.12} />
            <Stop offset="1" stopColor={colors.text.primary} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx="50" cy="13" rx="50" ry="13" fill="url(#shadow)" />
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
