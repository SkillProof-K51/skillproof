import { layout, space } from "@skillproof/tokens";
import { Image, type ImageSource } from "expo-image";
import { useState, type ReactNode } from "react";
import { StyleSheet, useWindowDimensions, View, type LayoutChangeEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GroundedMascot } from "./GroundedMascot";
import { mascotSize, type MascotPose } from "./Mascot";
import { SkyBackdrop } from "./SkyBackdrop";
import { SpeechBubble } from "./SpeechBubble";

// Hero geometry, written once here:
const HEADER_BELOW_STATUS_BAR = 13; // the first line starts 13 below the status bar
const MASCOT_INSET_RIGHT = 20; // right-aligned mascot: 20 from the screen edge
const MASCOT_LIFT = 62; // the mascot's feet sit 62 above the hero bottom (30 above the lip)
const BUBBLE_DROP = 34; // a short speech bubble's top sits 34 below the mascot's top
const DEFAULT_MASCOT_WIDTH = 142;
// content in the hero ends 24 above the sky's edge (the top of the lip)
const CONTENT_BOTTOM = layout.skyLip + space.xl;

type Props = {
  /** tall (290) = Home / Welcome / a module's first screen · compact (180) = sub-screens, auth, lists. */
  size?: "tall" | "compact";
  /** Minimum height of the sky (e.g. 300). The hero grows taller if its content needs it. */
  height?: number;
  /** A mascot standing at the bottom right of the sky. Leave out on task screens. */
  mascot?: MascotPose;
  mascotWidth?: number;
  /** right = beside a greeting (module homes) · center = onboarding and level-ups. */
  mascotAlign?: "right" | "center";
  /** Short speech bubble to the left of the mascot. One line, ~40 characters. */
  bubble?: string;
  /**
   * An illustrated scene across the top instead of the sky (Home, BitePal-style, Azim 24 Oct). It
   * is `layout.sceneHeight` tall and the first card slides `layout.sceneOverlap` up over its bottom.
   */
  scene?: ImageSource | number;
  /**
   * No sky: the title sits on the page itself, BitePal-style (tab screens, Azim 25 Oct). The first
   * card follows `space.xl` below the hero's content.
   */
  plain?: boolean;
  /** The hero's content (greeting, title, and anything else), laid out top-down under the status bar. */
  children?: ReactNode;
};

/**
 * Screen-top hero: sky backdrop + optional mascot and speech bubble + your content in normal flow.
 * The sky grows with the content (never shorter than `size`/`height`). Put it first in a <Screen>;
 * the content after it starts on the sheet, `layout.sheetGap` below the sky's edge, automatically.
 */
export function Hero({ size = "tall", height, mascot, mascotWidth = DEFAULT_MASCOT_WIDTH, mascotAlign = "right", bubble, scene, plain, children }: Props) {
  if (scene) return <SceneHero scene={scene}>{children}</SceneHero>;
  if (plain) return <PlainHero>{children}</PlainHero>;
  return <SkyHero {...{ size, height, mascot, mascotWidth, mascotAlign, bubble }}>{children}</SkyHero>;
}

/** Just the content, under the status bar, on the page colour. */
function PlainHero({ children }: { children?: ReactNode }) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.plain, { paddingTop: insets.top + HEADER_BELOW_STATUS_BAR }]}>{children}</View>;
}

/** The illustrated scene: the picture fills the top, anchored to its ground line at the bottom. */
function SceneHero({ scene, children }: { scene: ImageSource | number; children?: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.scene, { paddingTop: insets.top + HEADER_BELOW_STATUS_BAR }]}>
      <Image source={scene} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="bottom" accessible={false} />
      {children}
    </View>
  );
}

function SkyHero({ size = "tall", height, mascot, mascotWidth = DEFAULT_MASCOT_WIDTH, mascotAlign = "right", bubble, children }: Omit<Props, "scene">) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const minHeight = height ?? (size === "tall" ? layout.heroTall : layout.heroCompact);
  const [h, setH] = useState(minHeight); // the hero's real height once laid out
  const onLayout = (e: LayoutChangeEvent) => setH(Math.round(e.nativeEvent.layout.height));

  const m = mascot ? mascotSize(mascot, mascotWidth) : null;
  const mascotTop = m ? h - MASCOT_LIFT - m.height : 0;
  const mascotX = m && (mascotAlign === "right" ? { right: MASCOT_INSET_RIGHT } : { left: (screenWidth - m.width) / 2 });

  return (
    <View
      onLayout={onLayout}
      style={[styles.hero, { minHeight, paddingTop: insets.top + HEADER_BELOW_STATUS_BAR }]}
    >
      <SkyBackdrop size={size} height={h} />
      {mascot && m ? <GroundedMascot pose={mascot} width={m.width} style={[styles.absolute, { top: mascotTop }, mascotX]} /> : null}
      {bubble && m ? <SpeechBubble text={bubble} style={[styles.absolute, styles.bubble, { top: mascotTop + BUBBLE_DROP }]} /> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginBottom: layout.sheetGap - layout.skyLip, // pulls the next content up under the lip, then down by sheetGap
    paddingHorizontal: layout.gutter,
    paddingBottom: CONTENT_BOTTOM,
  },
  plain: { paddingHorizontal: layout.gutter, paddingBottom: space.xl },
  scene: {
    minHeight: layout.sceneHeight,
    marginBottom: -layout.sceneOverlap, // the first card slides up over the scene's ground
    paddingHorizontal: layout.gutter,
  },
  absolute: { position: "absolute" },
  bubble: { left: layout.gutter },
});
