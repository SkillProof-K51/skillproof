import { layout, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card, Mascot, MascotShadow, Screen, SkyBackdrop, Text } from "./ui";
import type { MascotPose } from "./ui";

type Props = {
  title: string;
  module: string;
  owner: string;
  pose: MascotPose;
};

/** Stand-in first screen for a module tab until its owner builds it (weeks 7–11). */
export function ModulePlaceholder({ title, module, owner, pose }: Props) {
  const insets = useSafeAreaInsets();
  const hero = layout.heroTall;
  return (
    <Screen>
      <View style={{ height: hero, marginBottom: -(layout.skyLip + layout.heroOverlap) }}>
        <SkyBackdrop height={hero} />
        <View style={[styles.heading, { top: insets.top + 13 }]}>
          <Text variant="title">{title}</Text>
          <Text variant="small" color="secondary">
            {module} · {owner}
          </Text>
        </View>
        <MascotShadow width={88} style={styles.shadow} />
        <Mascot pose={pose} width={142} style={styles.mascot} />
      </View>
      <View style={styles.content}>
        <Card>
          <Text variant="heading">Coming in weeks 7–11</Text>
          <Text variant="small" color="secondary" style={styles.gap}>
            {owner} designs the screens for this module in Figma on the shared design system, then builds them
            with the components in components/ui.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { position: "absolute", left: layout.gutter, right: layout.gutter, gap: 2 },
  mascot: { position: "absolute", right: 20, top: 106 },
  shadow: { position: "absolute", right: 47, top: 229 },
  content: { paddingHorizontal: layout.gutter, gap: 14 },
  gap: { marginTop: space.xs },
});
