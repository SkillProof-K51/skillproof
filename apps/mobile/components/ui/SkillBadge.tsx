import { colors, motion } from "@skillproof/tokens";
import { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { Icon } from "./Icon";
import { NATIVE_DRIVER, useDuration } from "./motion";
import { SkillLogo, skillLogoCount } from "./SkillLogo";
import type { SkillStatus } from "./StatusBadge";

const WIDTH = 84; // three across in a card, like Azim's "Awards & highlights" reference (24 Oct)
const SQRT3 = Math.sqrt(3); // a pointy-top hexagon is 2/√3 as tall as it is wide
const CORNER = 0.22; // corner rounding, as a share of a side
// The gold ring, at the default width (it scales with the badge):
const RIM = 5; // this far inside the edge
const RIM_STROKE = 2;
const DASH = [5, 4]; // a Practised ring is dashed: unlocked, not sealed by a mentor yet
const LOGO = 0.4; // one logo, as a share of the width
const LOGO_PAIR = 0.25; // each of two logos ("HTML and CSS")
const LOCK = 0.3;
const DISC = 0.29; // the white disc behind a Verified badge's logo (radius, share of the width)
const FADED = 0.45; // a Practised badge's logo

// The pop, as keyframes over motion.pop: the old face draws in, the new one springs past its size,
// gold sparks fly out at the peak and fade.
const KEYS = [0, 0.25, 0.32, 0.55, 0.78, 1];
const SCALE = [1, 0.86, 0.9, 1.12, 0.97, 1];
const SWAP = [1, 1, 0, 0, 0, 0]; // the old face, then the new one
const SPARKS = 8;
const SPARK = 0.09; // a spark's size, as a share of the width
const SPARK_SMALL = 0.6; // every other spark is this much smaller
const SPARK_FROM = 0.5; // sparks leave from this far out (share of the width)…
const SPARK_TO = 0.74; // …and fade out here
const SPARK_TIMES = [0.32, 0.55, 1]; // they appear as the new face springs, peak with it, then fade

const SAID: Record<SkillStatus, string> = {
  verified: "Verified",
  practised: "Practised, not Verified yet",
  not_yet: "locked",
};

/** A pointy-top hexagon with rounded corners, `inset` inside a box `width` wide and 2/√3 as tall. */
function hexagon(width: number, inset = 0): string {
  const cx = width / 2;
  const cy = width / SQRT3;
  const r = width / SQRT3 - (2 * inset) / SQRT3; // a side is as long as the radius
  const pts = [-90, -30, 30, 90, 150, 210].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const toward = (p: number[], q: number[]) => p.map((v, i) => (v + (q[i] - v) * CORNER).toFixed(2)).join(",");
  const corners = pts.map((p, i) => {
    const from = toward(p, pts[(i + 5) % 6]);
    const to = toward(p, pts[(i + 1) % 6]);
    return `${i ? "L" : "M"}${from} Q${p.map((v) => v.toFixed(2)).join(",")} ${to}`;
  });
  return `${corners.join(" ")} Z`;
}

/** A four-point spark, `s` across. */
const spark = (s: number) => {
  const m = s / 2;
  return `M${m},0 Q${m},${m} ${s},${m} Q${m},${m} ${m},${s} Q${m},${m} 0,${m} Q${m},${m} ${m},0 Z`;
};

type Props = {
  skill: string;
  status: SkillStatus;
  /** Width; the hexagon is 2/√3 as tall. */
  size?: number;
  /**
   * The win moment on a Result: start as this status and pop open into `status` (not_yet →
   * practised for Module 3, practised → verified for Module 4). It waits a beat (motion.standard)
   * so the eye finds the badge first, and lands at rest under Reduce Motion.
   */
  from?: SkillStatus;
};

/**
 * A skill's badge, in the passport's navy and gold (Azim's pick, 25 Oct): a rounded hexagon.
 * Verified = earned, a navy medal with a gold rim · Practised = a dashed gold outline with the
 * logo faded, waiting for a mentor · not yet = grey with a lock. Statuses arrive from Modules 3
 * and 4; this only draws them.
 */
export function SkillBadge({ skill, status, size = WIDTH, from }: Props) {
  const height = (2 * size) / SQRT3;
  const duration = useDuration("pop");
  const [t] = useState(() => new Animated.Value(from ? 0 : 1));

  useEffect(() => {
    if (!from) return;
    if (!duration) {
      t.setValue(1);
      return;
    }
    t.setValue(0);
    const anim = Animated.sequence([
      Animated.delay(motion.standard),
      Animated.timing(t, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: NATIVE_DRIVER }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [from, duration, t]);

  const label = `${skill} badge, ${SAID[status]}`;
  if (!from) {
    return (
      <View style={{ width: size, height }} accessibilityRole="image" accessibilityLabel={label}>
        <Face skill={skill} status={status} size={size} />
      </View>
    );
  }

  const scale = t.interpolate({ inputRange: KEYS, outputRange: SCALE });
  const before = t.interpolate({ inputRange: KEYS, outputRange: SWAP });
  const after = t.interpolate({ inputRange: KEYS, outputRange: SWAP.map((v) => 1 - v) });
  return (
    <View style={{ width: size, height }} accessibilityRole="image" accessibilityLabel={label}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale }] }]}>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: before }]}>
          <Face skill={skill} status={from} size={size} />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: after }]}>
          <Face skill={skill} status={status} size={size} />
        </Animated.View>
      </Animated.View>
      <Sparks t={t} size={size} height={height} />
    </View>
  );
}

/** The badge's drawing for one status. */
function Face({ skill, status, size }: { skill: string; status: SkillStatus; size: number }) {
  const verified = status === "verified";
  const height = (2 * size) / SQRT3;
  const logo = size * (skillLogoCount(skill) > 1 ? LOGO_PAIR : LOGO);
  const k = size / WIDTH; // the ring scales with the badge
  return (
    <>
      <Svg width={size} height={height}>
        <Path d={hexagon(size)} fill={verified ? colors.passport.cover : colors.bg.subtle} />
        {status !== "not_yet" ? (
          <Path
            d={hexagon(size, RIM * k)}
            fill="none"
            stroke={colors.passport.gold}
            strokeWidth={RIM_STROKE * k}
            strokeDasharray={verified ? undefined : DASH.map((d) => d * k).join(" ")}
          />
        ) : null}
        {verified ? <Circle cx={size / 2} cy={height / 2} r={size * DISC} fill={colors.bg.surface} /> : null}
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
        {status === "not_yet" ? (
          <Icon name="lock" weight="fill" size={size * LOCK} color={colors.icon.muted} />
        ) : (
          <View style={verified ? undefined : styles.faded}>
            <SkillLogo skill={skill} size={logo} />
          </View>
        )}
      </View>
    </>
  );
}

/** Gold sparks thrown out round the badge as it opens; gone again when it settles. */
function Sparks({ t, size, height }: { t: Animated.Value; size: number; height: number }) {
  return (
    <>
      {Array.from({ length: SPARKS }, (_, i) => {
        const angle = ((i + 0.5) / SPARKS) * 2 * Math.PI;
        const s = size * SPARK * (i % 2 ? SPARK_SMALL : 1);
        const out = (d: number) => [Math.cos(angle) * d * size, Math.sin(angle) * d * size];
        const [x0, y0] = out(SPARK_FROM);
        const [x1, y1] = out(SPARK_TO);
        const range = { inputRange: SPARK_TIMES, extrapolate: "clamp" as const };
        return (
          <Animated.View
            key={i}
            pointerEvents="none"
            style={[
              styles.spark,
              {
                left: size / 2 - s / 2,
                top: height / 2 - s / 2,
                opacity: t.interpolate({ ...range, outputRange: [0, 1, 0] }),
                transform: [
                  { translateX: t.interpolate({ ...range, outputRange: [x0, (x0 + x1) / 2, x1] }) },
                  { translateY: t.interpolate({ ...range, outputRange: [y0, (y0 + y1) / 2, y1] }) },
                  { scale: t.interpolate({ ...range, outputRange: [0, 1, 0] }) },
                ],
              },
            ]}
          >
            <Svg width={s} height={s}>
              <Path d={spark(s)} fill={colors.passport.gold} />
            </Svg>
          </Animated.View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" },
  faded: { opacity: FADED },
  spark: { position: "absolute" },
});
