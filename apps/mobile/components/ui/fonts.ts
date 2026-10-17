import {
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
} from "@expo-google-fonts/lexend";
import { RobotoMono_400Regular } from "@expo-google-fonts/roboto-mono";
import type { TypeStyle } from "@skillproof/tokens";

/** Passed to `useFonts` once in the root layout. */
export const fontsToLoad = {
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  RobotoMono_400Regular,
};

/** Token family + weight → the loaded font's name. */
export function fontFamilyFor(family: TypeStyle["family"], weight: TypeStyle["weight"]): string {
  if (family === "mono") return "RobotoMono_400Regular";
  if (weight === 600) return "Lexend_600SemiBold";
  if (weight === 500) return "Lexend_500Medium";
  return "Lexend_400Regular";
}
