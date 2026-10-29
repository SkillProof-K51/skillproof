import type { ExpoConfig } from "expo/config";

// Config files can't import TypeScript from another package, so colours come from the generated
// tokens.json (same values as @skillproof/tokens). Never type a hex value here.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const tokens = require("@skillproof/tokens/tokens.json") as { colors: { bg: { app: string }; accent: { brand: string } } };

const config: ExpoConfig = {
  name: "SkillProof",
  slug: "skillproof",
  version: "0.1.0",
  scheme: "skillproof",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  ios: {
    supportsTablet: false,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: tokens.colors.accent.brand,
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: "./assets/favicon.png",
    bundler: "metro",
  },
  plugins: [
    "expo-status-bar",
    "expo-router",
    "expo-font",
    "expo-image",
    [
      "expo-splash-screen",
      {
        // the launch screen: the logo on the brand purple, at the size Welcome opens from
        // (app/(auth)/welcome.tsx · LOGO_LAUNCH = 52 high → 236 wide)
        backgroundColor: tokens.colors.accent.brand,
        image: "./assets/splash-icon.png",
        imageWidth: 236,
      },
    ],
  ],
};

export default config;
