import { colors, radius, space } from "@skillproof/tokens";
import { useId, useState, type ReactNode } from "react";
import { StyleSheet, View, type LayoutChangeEvent, type ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

type Props = {
  style?: ViewStyle;
  children: ReactNode;
};

/**
 * A rounded sky surface inside the page — the celebration beat of a Result screen, or anywhere a
 * mascot or stamp needs the sky behind it without a full Hero. Sky at the top fading into the
 * page colour (Azim's pick, 18 Oct), so it sits lightly under the painted hero.
 */
export function SkyPanel({ style, children }: Props) {
  const id = `sky${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  // the gradient is drawn at the panel's measured size: percentage sizes don't fill on the web
  const [size, setSize] = useState({ width: 0, height: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((s) => (s.width === width && s.height === height ? s : { width, height }));
  };
  return (
    <View style={[styles.panel, style]} onLayout={onLayout}>
      <Svg width={size.width} height={size.height} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.accent.sky} />
            <Stop offset="1" stopColor={colors.bg.app} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={size.width} height={size.height} fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderRadius: radius.lg, padding: space.lg, overflow: "hidden", alignItems: "center", gap: space.md, backgroundColor: colors.accent.sky },
});
