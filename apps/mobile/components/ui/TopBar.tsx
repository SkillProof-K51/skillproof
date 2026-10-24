import { space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { IconButton } from "./IconButton";
import { Text } from "./Text";

type Props = {
  /** Leave out when the hero says the title in large type right below (sign up, log in). */
  title?: string;
  /** A small grey line under the title, e.g. "Node.js · about 3 min". */
  subtitle?: string;
  /** Override the back action. Default: go back, or to Home when there's nothing to go back to. */
  onBack?: () => void;
  /** At the right: usually one IconButton (share, more). */
  action?: ReactNode;
};

/**
 * The top of a sub-screen (Edit profile, a challenge, a project): back button, centred title,
 * optional action, and an optional subtitle under the title. Put it first inside <Hero>.
 */
export function TopBar({ title, subtitle, onBack, action }: Props) {
  const router = useRouter();
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace("/")));
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        <IconButton icon="chevron-left" accessibilityLabel="Back" onPress={back} />
      </View>
      {title ? (
        <View style={styles.title}>
          <Text variant="heading" align="center" numberOfLines={1} accessibilityRole="header">
            {title}
          </Text>
          {subtitle ? (
            <Text variant="caption" color="secondary" align="center" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      ) : (
        <View style={styles.title} />
      )}
      <View style={[styles.side, styles.end]}>{action}</View>
    </View>
  );
}

const SIDE = 40; // matches IconButton, so the title stays centred with or without an action

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.sm },
  side: { width: SIDE },
  end: { alignItems: "flex-end" },
  title: { flex: 1 },
});
