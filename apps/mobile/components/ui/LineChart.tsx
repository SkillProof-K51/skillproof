import { colors, space } from "@skillproof/tokens";
import { useState } from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";

import { Text } from "./Text";

const HEIGHT = 120; // the plot
const INSET = 12; // the first and last points sit this far in, so their day labels fit
const LABEL = 24; // width of a day label, centred under its point
const TICKS = 28; // the 0 / 50 / 100 column on the right
const STROKE = 2; // dataviz mark specs: 2px line, ≥ 8px end dot with a 2px surface ring
const DOT = 4;
const RING = 2;
const WASH = 0.1; // the area under a single series, a wash — never a block
const END_LABEL = 48;

type Props = {
  /** One per point, 0–`max`, in order. */
  values: number[];
  /** One per point: "M", "T"… */
  labels: string[];
  max?: number;
  /** A line that means something on this scale, e.g. Ready at 70. */
  reference?: { value: number; label: string };
  /** The last value, written by its dot (the only point labelled). */
  format?: (value: number) => string;
  /** Every value in words: the chart's table view for screen readers. */
  accessibilityLabel: string;
};

/**
 * A single series over time (readiness this week), on its true scale (0–100 by default — a
 * flat-looking line is the honest one). One hue, a wash under it, solid hairline grid, the end
 * labelled. One axis only, never two. Values arrive computed (rule 2).
 */
export function LineChart({ values, labels, max = 100, reference, format, accessibilityLabel }: Props) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(Math.round(e.nativeEvent.layout.width));
  const plot = Math.max(0, width - TICKS);
  const x = (i: number) => INSET + (values.length > 1 ? (i * (plot - 2 * INSET)) / (values.length - 1) : 0);
  const y = (v: number) => HEIGHT - (Math.min(v, max) / max) * HEIGHT;
  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(values.length - 1).toFixed(1)},${HEIGHT} L${x(0).toFixed(1)},${HEIGHT} Z`;
  const last = values.length - 1;

  return (
    <View onLayout={onLayout} accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <View style={styles.plot}>
        {width ? (
          <Svg width={width} height={HEIGHT + DOT + RING}>
            {[0, max / 2, max].map((t) => (
              <Line key={t} x1={0} x2={plot} y1={y(t)} y2={y(t)} stroke={colors.border.default} strokeWidth={StyleSheet.hairlineWidth} />
            ))}
            {reference ? <Line x1={0} x2={plot} y1={y(reference.value)} y2={y(reference.value)} stroke={colors.icon.muted} strokeWidth={1} /> : null}
            <Path d={area} fill={colors.accent.progress} fillOpacity={WASH} />
            <Path d={line} fill="none" stroke={colors.accent.progress} strokeWidth={STROKE} strokeLinejoin="round" strokeLinecap="round" />
            <Circle cx={x(last)} cy={y(values[last])} r={DOT} fill={colors.accent.progress} stroke={colors.bg.surface} strokeWidth={RING} />
          </Svg>
        ) : null}
        {/* text in the app's own font, laid over the drawing */}
        {width
          ? [0, max / 2, max].map((t) => (
              <Text key={t} variant="caption" color="secondary" style={[styles.tick, { top: y(t) - space.sm }]}>
                {t}
              </Text>
            ))
          : null}
        {width && reference ? (
          <Text variant="caption" color="secondary" style={[styles.reference, { top: y(reference.value) - space.lg }]}>
            {reference.label}
          </Text>
        ) : null}
        {width && format ? (
          <Text variant="captionStrong" align="right" style={[styles.end, { left: x(last) - END_LABEL, top: y(values[last]) - space.xl }]}>
            {format(values[last])}
          </Text>
        ) : null}
      </View>
      <View style={styles.days}>
        {width
          ? labels.map((l, i) => (
              <Text key={i} variant="caption" color="secondary" align="center" style={[styles.day, { left: x(i) - LABEL / 2 }]}>
                {l}
              </Text>
            ))
          : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  plot: { height: HEIGHT + DOT + RING },
  tick: { position: "absolute", right: 0, width: TICKS, textAlign: "right" },
  reference: { position: "absolute", left: 0 },
  end: { position: "absolute", width: END_LABEL },
  days: { height: space.xl, marginTop: space.xs },
  day: { position: "absolute", width: LABEL },
});
