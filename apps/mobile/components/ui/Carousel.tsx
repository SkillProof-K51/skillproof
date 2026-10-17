import { colors, layout, radius, space } from "@skillproof/tokens";
import { useState, type ReactNode } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewStyle,
} from "react-native";

type Props<T> = {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  /** Read by screen readers, e.g. "Micro-projects for you". */
  accessibilityLabel: string;
};

const GAP = space.md; // between cards
const PEEK = 24; // how much of the next card shows at the right edge — tells people to swipe

/**
 * Horizontal, snapping carousel that bleeds through the screen gutter: card 1 lines up with the
 * page content, the next card peeks in from the right, dots underneath show the position.
 * Cards in one carousel are stretched to the same height. A single item renders full-width
 * with no scrolling and no dots.
 */
export function Carousel<T>({ items, keyExtractor, renderItem, accessibilityLabel }: Props<T>) {
  const { width } = useWindowDimensions();
  const [active, setActive] = useState(0);
  const gutter = layout.gutter;

  if (items.length <= 1) {
    return <>{items.map((item, i) => <View key={keyExtractor(item)}>{renderItem(item, i)}</View>)}</>;
  }

  const itemWidth = width - gutter - GAP - PEEK;
  const interval = itemWidth + GAP;
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / interval);
    setActive(Math.max(0, Math.min(items.length - 1, i)));
  };

  return (
    <View style={styles.wrap} accessibilityLabel={accessibilityLabel}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[{ marginHorizontal: -gutter }, webSnap.container(gutter)]}
        contentContainerStyle={{ paddingHorizontal: gutter, gap: GAP }}
        snapToInterval={interval}
        decelerationRate="fast"
        disableIntervalMomentum
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {items.map((item, i) => (
          <View key={keyExtractor(item)} style={[{ width: itemWidth }, webSnap.item]}>
            {renderItem(item, i)}
          </View>
        ))}
      </ScrollView>
      <View style={styles.dots} accessible={false}>
        {items.map((item, i) => (
          <View key={keyExtractor(item)} style={[styles.dot, i === active && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

// react-native-web ignores snapToInterval; the browser equivalent is CSS scroll-snap, so the web
// preview snaps like the phone. (These CSS properties aren't in React Native's style types.)
const webSnap = {
  container: (gutter: number) =>
    Platform.OS === "web" ? ({ scrollSnapType: "x mandatory", scrollPaddingLeft: gutter } as unknown as ViewStyle) : null,
  item: Platform.OS === "web" ? ({ scrollSnapAlign: "start" } as unknown as ViewStyle) : null,
};

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6 },
  // blue = projects (same rule as the Icon badge and the featured card)
  dot: { width: 6, height: 6, borderRadius: radius.full, backgroundColor: colors.accent.sky },
  dotActive: { width: 16, backgroundColor: colors.status.practised.fg },
});
