import { layout, space } from "@skillproof/tokens";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_BELOW_STATUS_BAR = 13; // the first line starts 13 below the status bar

type Props = {
  /** The hero's content (greeting, title, a TopBar…), laid out top-down under the status bar. */
  children?: ReactNode;
};

/**
 * The top of every screen: your content under the status bar, on the page colour, with the first
 * card `space.xl` below (the BitePal look). Put it first in a <Screen>. (The illustrated scene that
 * Home and Welcome once used went on 29 Oct.)
 */
export function Hero({ children }: Props) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.plain, { paddingTop: insets.top + HEADER_BELOW_STATUS_BAR }]}>{children}</View>;
}

const styles = StyleSheet.create({
  plain: { paddingHorizontal: layout.gutter, paddingBottom: space.xl },
});
