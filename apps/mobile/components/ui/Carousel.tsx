import { layout, space } from "@skillproof/tokens";
import type { ReactNode } from "react";
import { Platform, ScrollView, useWindowDimensions, View, type ViewStyle } from "react-native";

type Props<T> = {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  /** Read by screen readers, e.g. "Micro-projects for you". */
  accessibilityLabel: string;
};

const GAP = space.md; // between cards
const PEEK = 24; // how much of the next card shows at the right edge — the only "swipe me" hint

/**
 * Horizontal, snapping carousel that bleeds through the screen gutter: card 1 lines up with the
 * page content and the next card peeks in from the right. No dots (Azim, 18 Oct) — the peek does
 * that job. Cards in one carousel are stretched to the same height. A single item renders
 * full-width with no scrolling.
 */
export function Carousel<T>({ items, keyExtractor, renderItem, accessibilityLabel }: Props<T>) {
  const { width } = useWindowDimensions();
  const gutter = layout.gutter;

  if (items.length <= 1) {
    return <>{items.map((item, i) => <View key={keyExtractor(item)}>{renderItem(item, i)}</View>)}</>;
  }

  const itemWidth = width - gutter - GAP - PEEK;
  return (
    <ScrollView
      horizontal
      accessibilityLabel={accessibilityLabel}
      showsHorizontalScrollIndicator={false}
      style={[{ marginHorizontal: -gutter }, webSnap.container(gutter)]}
      contentContainerStyle={{ paddingHorizontal: gutter, gap: GAP }}
      snapToInterval={itemWidth + GAP}
      decelerationRate="fast"
      disableIntervalMomentum
    >
      {items.map((item, i) => (
        <View key={keyExtractor(item)} style={[{ width: itemWidth }, webSnap.item]}>
          {renderItem(item, i)}
        </View>
      ))}
    </ScrollView>
  );
}

// react-native-web ignores snapToInterval; the browser equivalent is CSS scroll-snap, so the web
// preview snaps like the phone. (These CSS properties aren't in React Native's style types.)
const webSnap = {
  container: (gutter: number) =>
    Platform.OS === "web" ? ({ scrollSnapType: "x mandatory", scrollPaddingLeft: gutter } as unknown as ViewStyle) : null,
  item: Platform.OS === "web" ? ({ scrollSnapAlign: "start" } as unknown as ViewStyle) : null,
};
