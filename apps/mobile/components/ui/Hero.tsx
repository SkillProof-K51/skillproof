import { layout, space } from "@skillproof/tokens";
import { Image, type ImageSource } from "expo-image";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_BELOW_STATUS_BAR = 13; // the first line starts 13 below the status bar

type Props = {
  /**
   * An illustrated scene across the top (Home, Welcome — BitePal-style, Azim 24 Oct). It is
   * `layout.sceneHeight` tall and the first card slides `layout.sceneOverlap` up over its bottom.
   * Leave it out for the plain header: the title on the page itself.
   */
  scene?: ImageSource | number;
  /** The hero's content (greeting, title, a TopBar…), laid out top-down under the status bar. */
  children?: ReactNode;
};

/**
 * The top of every screen. Plain (the default): your content under the status bar, on the page
 * colour, with the first card `space.xl` below. With `scene`: the picture fills the top, anchored to
 * its ground line, and the content sits on it. Put it first in a <Screen>.
 */
export function Hero({ scene, children }: Props) {
  const insets = useSafeAreaInsets();
  const top = { paddingTop: insets.top + HEADER_BELOW_STATUS_BAR };
  if (!scene) return <View style={[styles.plain, top]}>{children}</View>;
  return (
    <View style={[styles.scene, top]}>
      <Image source={scene} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="bottom" accessible={false} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  plain: { paddingHorizontal: layout.gutter, paddingBottom: space.xl },
  scene: {
    minHeight: layout.sceneHeight,
    marginBottom: -layout.sceneOverlap, // the first card slides up over the scene's ground
    paddingHorizontal: layout.gutter,
  },
});
