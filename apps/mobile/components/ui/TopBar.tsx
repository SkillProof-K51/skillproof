import { space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { IconButton } from "./IconButton";
import { Text } from "./Text";

type Props = {
  title: string;
  /** Override the back action. Default: go back, or to Home when there's nothing to go back to. */
  onBack?: () => void;
  /** At the right: usually one IconButton (share, more). */
  action?: ReactNode;
};

/**
 * The top of a sub-screen (Edit profile, a challenge, a project): back button, centred title,
 * optional action. Put it first inside <Hero size="compact">.
 */
export function TopBar({ title, onBack, action }: Props) {
  const router = useRouter();
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace("/")));
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        <IconButton icon="chevron-left" accessibilityLabel="Back" onPress={back} />
      </View>
      <Text variant="heading" align="center" numberOfLines={1} style={styles.title} accessibilityRole="header">
        {title}
      </Text>
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
