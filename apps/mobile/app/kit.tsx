import { gap, layout, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { BasicsDemo } from "../components/kit/BasicsDemo";
import { FeedbackDemo } from "../components/kit/FeedbackDemo";
import { FormsDemo } from "../components/kit/FormsDemo";
import { ListsDemo } from "../components/kit/ListsDemo";
import { MascotDemo } from "../components/kit/MascotDemo";
import { ProgressDemo } from "../components/kit/ProgressDemo";
import { ResultsDemo } from "../components/kit/ResultsDemo";
import { Hero, Screen, Text, TopBar } from "../components/ui";

/**
 * The UI kit, live: every component in components/ui with its variants, on the real tokens.
 * Not a tab — open it at /kit on the web, or from a placeholder tab in a dev build. This is what
 * teammates plan their module screens from (docs/ui.md); the Figma file is no longer updated.
 */
export default function KitScreen() {
  return (
    <Screen aboveTabBar={false}>
      <Hero size="compact">
        <TopBar title="UI kit" />
        <View style={styles.heading}>
          <Text variant="small" color="secondary">
            Every component, every variant. The code is the design source of truth.
          </Text>
        </View>
      </Hero>
      <View style={styles.content}>
        <BasicsDemo />
        <FormsDemo />
        <ListsDemo />
        <FeedbackDemo />
        <ProgressDemo />
        <ResultsDemo />
        <MascotDemo />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: space.xxs, marginTop: space.md },
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
});
