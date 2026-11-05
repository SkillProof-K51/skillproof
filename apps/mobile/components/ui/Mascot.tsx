import { colors, motion } from "@skillproof/tokens";
import { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Circle, Ellipse, Path, Polygon } from "react-native-svg";

import { NATIVE_DRIVER, useReducedMotion } from "./motion";

// Gem is drawn on a 90 × 86 grid (a crop of 120 × 100): the body, its sparkles up right, the shadow.
const VIEW_W = 90;
const VIEW_H = 86;
const VIEWBOX = `20 14 ${VIEW_W} ${VIEW_H}`;
const WIDTH = 72; // Home's header
const FLOAT = 3; // how far it rises at rest
const GLOSS = 0.22;
const BLUSH = 0.8;
const SHADOW = 0.08;

type Props = {
  /** Width; the height follows (a little less — the sparkles make it wider than tall). */
  size?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Gem, the mascot (Azim, 29 Oct): a skill badge come alive — the rounded hexagon students earn,
 * with a face and no hands or feet. It floats above its shadow, still under Reduce Motion. It is
 * decoration, so screen readers skip it: what it says goes in a SpeechBubble beside it.
 */
export function Mascot({ size = WIDTH, style }: Props) {
  const reduced = useReducedMotion();
  const [t] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reduced) {
      t.setValue(0);
      return;
    }
    const half = { duration: motion.float, easing: Easing.inOut(Easing.sin), useNativeDriver: NATIVE_DRIVER };
    const loop = Animated.loop(
      Animated.sequence([Animated.timing(t, { toValue: 1, ...half }), Animated.timing(t, { toValue: 0, ...half })]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, t]);

  const height = (size * VIEW_H) / VIEW_W;
  const rise = t.interpolate({ inputRange: [0, 1], outputRange: [0, -FLOAT] });
  return (
    <View
      style={[{ width: size, height }, style]}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Svg width={size} height={height} viewBox={VIEWBOX} style={StyleSheet.absoluteFill}>
        <Ellipse cx={60} cy={95} rx={26} ry={3.2} fill={colors.text.primary} opacity={SHADOW} />
      </Svg>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY: rise }] }]}>
        <Svg width={size} height={height} viewBox={VIEWBOX}>
          {/* the body: the skill badge's hexagon, its corners rounded by a thick stroke */}
          <Polygon
            points="60,24 89,40.5 89,73.5 60,90 31,73.5 31,40.5"
            fill={colors.accent.brand}
            stroke={colors.accent.brand}
            strokeWidth={12}
            strokeLinejoin="round"
          />
          <Polygon
            points="60,33 81,45 81,69 60,81 39,69 39,45"
            fill={colors.mascot.facet}
            stroke={colors.mascot.facet}
            strokeWidth={6}
            strokeLinejoin="round"
          />
          <Ellipse cx={44} cy={36} rx={8} ry={4} transform="rotate(-30 44 36)" fill={colors.bg.surface} opacity={GLOSS} />
          {/* the face, looking a little right — at what it says */}
          <Ellipse cx={49} cy={54} rx={8} ry={9.5} fill={colors.bg.surface} />
          <Ellipse cx={71} cy={54} rx={8} ry={9.5} fill={colors.bg.surface} />
          <Circle cx={50} cy={56} r={4.8} fill={colors.text.primary} />
          <Circle cx={72} cy={56} r={4.8} fill={colors.text.primary} />
          <Circle cx={52} cy={54} r={1.7} fill={colors.bg.surface} />
          <Circle cx={74} cy={54} r={1.7} fill={colors.bg.surface} />
          <Ellipse cx={39} cy={66} rx={4.5} ry={2.6} fill={colors.mascot.blush} opacity={BLUSH} />
          <Ellipse cx={81} cy={66} rx={4.5} ry={2.6} fill={colors.mascot.blush} opacity={BLUSH} />
          <Path d="M55 66 Q60 70 65 66" fill="none" stroke={colors.text.primary} strokeWidth={2.4} strokeLinecap="round" />
          {/* sparkles */}
          <Path d="M96 20 Q97 26 102 27 Q97 28 96 34 Q95 28 90 27 Q95 26 96 20 Z" fill={colors.accent.butter} />
          <Path d="M103 36 Q103.5 39 106 39.5 Q103.5 40 103 43 Q102.5 40 100 39.5 Q102.5 39 103 36 Z" fill={colors.accent.butter} />
        </Svg>
      </Animated.View>
    </View>
  );
}
