import { colors, layout, radius } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, G, LinearGradient, Path, Rect, Stop } from "react-native-svg";

type Size = "tall" | "compact";

// Cloud shapes traced from the Figma component (390-wide artboard). The gradient and the lip are
// drawn natively so they scale to any phone width; the clouds stretch with the width (≤ 10 %).
const CLOUDS: Record<Size, { d: string; opacity: number }[]> = {
  tall: [
    {
      d: "M266 112C276.259 112 285.13 116.343 289.359 122.649C291.455 122.228 293.686 122 296 122C308.15 122 318 128.268 318 136C318 143.732 308.15 150 296 150C290.326 150 285.153 148.633 281.251 146.388C276.967 148.659 271.698 150 266 150C262.548 150 259.254 149.507 256.24 148.614C252.861 149.5 249.043 150 245 150C231.193 150 220 144.18 220 137C220 130.39 229.486 124.932 241.765 124.107C245.541 117.022 254.968 112 266 112Z",
      opacity: 0.7,
    },
    {
      d: "M80 192C92.2345 192 102.864 197.365 108.248 205.247C111.285 204.441 114.57 204 118 204C133.464 204 146 212.954 146 224C146 235.046 133.464 244 118 244C110.032 244 102.841 241.623 97.7422 237.807C92.6643 240.455 86.5633 242 80 242C75.8147 242 71.8175 241.371 68.1533 240.229C63.5681 241.364 58.4285 242 53 242C33.67 242 18 233.941 18 224C18 214.362 32.7294 206.493 51.2432 206.022C56.4465 197.719 67.3681 192 80 192Z",
      opacity: 0.75,
    },
    {
      d: "M302 162C322.029 162 339.599 170.076 349.497 182.217C350.972 182.074 352.475 182 354 182C373.882 182 390 194.536 390 210C390 225.464 373.882 238 354 238C349.321 238 344.85 237.305 340.749 236.041C330.689 243.447 317.037 248 302 248C294.861 248 288.034 246.972 281.755 245.102C273.951 246.959 265.218 248 256 248C222.863 248 196 234.569 196 218C196 202.363 219.928 189.522 250.476 188.128C259.018 172.766 278.872 162 302 162Z",
      opacity: 0.8,
    },
  ],
  compact: [
    {
      d: "M346 30C356.259 30 365.13 34.3428 369.359 40.6494C371.455 40.2278 373.686 40 376 40C388.15 40 398 46.268 398 54C398 61.732 388.15 68 376 68C370.326 68 365.153 66.6326 361.251 64.3877C356.967 66.6591 351.698 68 346 68C342.548 68 339.254 67.5068 336.24 66.6143C332.861 67.5002 329.043 68 325 68C311.193 68 300 62.1797 300 55C300 48.3904 309.486 42.9325 321.765 42.1074C325.541 35.0217 334.968 30 346 30Z",
      opacity: 0.7,
    },
    {
      d: "M282 104C294.234 104 304.864 109.365 310.248 117.247C313.285 116.441 316.57 116 320 116C335.464 116 348 124.954 348 136C348 147.046 335.464 156 320 156C312.032 156 304.841 153.623 299.742 149.807C294.664 152.455 288.563 154 282 154C277.815 154 273.817 153.371 270.153 152.229C265.568 153.364 260.428 154 255 154C235.67 154 220 145.941 220 136C220 126.362 234.729 118.493 253.243 118.022C258.447 109.719 269.368 104 282 104Z",
      opacity: 0.75,
    },
  ],
};

type Props = {
  /** tall (290) = Home / Welcome / a module's first screen with a mascot; compact (180) = sub-screens, auth, lists. */
  size?: Size;
  /** Stretch the hero (e.g. Home uses 300). The lip stays pinned to the bottom. */
  height?: number;
};

/**
 * Screen-top sky: gradient, clouds and the sheet lip in bg/app. Put it first inside a hero View of
 * the same height; place greeting, mascot and bubble on top. Content below overlaps the lip by 24.
 */
export function SkyBackdrop({ size = "tall", height }: Props) {
  const base = size === "tall" ? layout.heroTall : layout.heroCompact;
  const h = height ?? base;
  const shift = h - base; // clouds keep their distance from the lip when the hero is stretched
  return (
    <View style={[StyleSheet.absoluteFill, { height: h }]} pointerEvents="none">
      <Svg width="100%" height={h} viewBox={`0 0 ${layout.designWidth} ${h}`} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0" stopColor={colors.sky.top} />
            <Stop offset="0.62" stopColor={colors.sky.mid} />
            <Stop offset="1" stopColor={colors.sky.bottom} />
          </LinearGradient>
        </Defs>
        <Rect width={layout.designWidth} height={h} fill="url(#sky)" />
        <G transform={`translate(0 ${shift})`}>
          {CLOUDS[size].map((cloud, i) => (
            <Path key={i} d={cloud.d} fill={colors.bg.surface} fillOpacity={cloud.opacity} />
          ))}
        </G>
      </Svg>
      <View style={styles.lip} />
    </View>
  );
}

const styles = StyleSheet.create({
  lip: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: layout.skyLip,
    backgroundColor: colors.bg.app,
    borderTopLeftRadius: radius.sky,
    borderTopRightRadius: radius.sky,
  },
});
