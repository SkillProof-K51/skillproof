import { layout } from "@skillproof/tokens";
import type { ReactNode } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Mascot, mascotSize, type MascotPose } from "./Mascot";
import { MascotShadow } from "./MascotShadow";
import { SkyBackdrop } from "./SkyBackdrop";
import { SpeechBubble } from "./SpeechBubble";

// Hero geometry, measured from the Figma frames (390 wide) and written once here:
const HEADER_BELOW_STATUS_BAR = 13; // header top 72 under a 59 px status bar
const MASCOT_INSET_RIGHT = 20; // right-aligned mascot: 20 from the screen edge (Home, M3 Challenges)
const MASCOT_LIFT = 62; // the mascot's feet sit 62 above the hero bottom (30 above the lip)
const SHADOW_RATIO = 0.62; // shadow width ≈ 62 % of the mascot (Figma note)
const SHADOW_TUCK = 9; // the shadow's top sits 9 px above the mascot's feet
const BUBBLE_DROP = 34; // the speech bubble's top sits 34 below the mascot's top (Home)
const DEFAULT_MASCOT_WIDTH = 142; // Home's Wave

type Props = {
  /** tall (290) = Home / Welcome / a module's first screen · compact (180) = sub-screens, auth, lists. */
  size?: "tall" | "compact";
  /** Stretch the sky, e.g. Home uses 300. */
  height?: number;
  /** One hero mascot per module home (docs/ui.md). Leave out on task screens. */
  mascot?: MascotPose;
  mascotWidth?: number;
  /** right = beside a greeting (Home, module homes) · center = onboarding and level-ups. */
  mascotAlign?: "right" | "center";
  /** Speech bubble to the left of a right-aligned mascot. One short line, ~40 characters. */
  bubble?: string;
  /** The header: greeting / title, placed under the status bar between the gutters. */
  children?: ReactNode;
};

/**
 * Screen-top hero: sky backdrop + optional mascot, ground shadow and speech bubble + a header slot.
 * Put it first in a <Screen>; the content after it overlaps the sky's lip by 24 automatically.
 */
export function Hero({ size = "tall", height, mascot, mascotWidth = DEFAULT_MASCOT_WIDTH, mascotAlign = "right", bubble, children }: Props) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const h = height ?? (size === "tall" ? layout.heroTall : layout.heroCompact);

  const m = mascot ? mascotSize(mascot, mascotWidth) : null;
  const mascotTop = m ? h - MASCOT_LIFT - m.height : 0;
  const shadowWidth = m ? Math.round(m.width * SHADOW_RATIO) : 0;
  const mascotX = m && (mascotAlign === "right" ? { right: MASCOT_INSET_RIGHT } : { left: (screenWidth - m.width) / 2 });

  return (
    <View style={{ height: h, marginBottom: -(layout.skyLip + layout.heroOverlap) }}>
      <SkyBackdrop size={size} height={h} />
      {mascot && m ? (
        <View style={[styles.mascotSlot, { top: mascotTop, width: m.width, height: m.height }, mascotX]} pointerEvents="none">
          {/* shadow first so it sits behind the feet */}
          <MascotShadow width={shadowWidth} style={{ position: "absolute", left: (m.width - shadowWidth) / 2, top: m.height - SHADOW_TUCK }} />
          <Mascot pose={mascot} width={m.width} />
        </View>
      ) : null}
      {bubble && m ? <SpeechBubble text={bubble} style={[styles.bubble, { top: mascotTop + BUBBLE_DROP }]} /> : null}
      <View style={[styles.header, { top: insets.top + HEADER_BELOW_STATUS_BAR }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  mascotSlot: { position: "absolute" },
  bubble: { position: "absolute", left: layout.gutter },
  header: { position: "absolute", left: layout.gutter, right: layout.gutter },
});
