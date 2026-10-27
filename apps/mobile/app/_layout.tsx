import { colors } from "@skillproof/tokens";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { TestModeFrame } from "../components/TestModeFrame";
import { ToastProvider } from "../components/ui";
import { fontsToLoad } from "../components/ui/fonts";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontsToLoad);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  // Keep the splash up until the fonts are ready, so no screen ever flashes the system font.
  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <TestModeFrame>
        <ToastProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg.app } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="kit" />
          </Stack>
        </ToastProvider>
      </TestModeFrame>
    </SafeAreaProvider>
  );
}
