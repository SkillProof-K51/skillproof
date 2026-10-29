import { RobotoMono_400Regular } from "@expo-google-fonts/roboto-mono";
import {
  SofiaSans_400Regular,
  SofiaSans_500Medium,
  SofiaSans_600SemiBold,
  SofiaSans_700Bold,
  SofiaSans_800ExtraBold,
  SofiaSans_900Black,
} from "@expo-google-fonts/sofia-sans";
import { SofiaSansCondensed_800ExtraBold } from "@expo-google-fonts/sofia-sans-condensed";
import type { TypeStyle } from "@skillproof/tokens";

/** Passed to `useFonts` once in the root layout. */
export const fontsToLoad = {
  SofiaSans_400Regular,
  SofiaSans_500Medium,
  SofiaSans_600SemiBold,
  SofiaSans_700Bold,
  SofiaSans_800ExtraBold,
  SofiaSans_900Black,
  SofiaSansCondensed_800ExtraBold,
  RobotoMono_400Regular,
};

const SANS: Record<TypeStyle["weight"], string> = {
  400: "SofiaSans_400Regular",
  500: "SofiaSans_500Medium",
  600: "SofiaSans_600SemiBold",
  700: "SofiaSans_700Bold",
  800: "SofiaSans_800ExtraBold",
  900: "SofiaSans_900Black",
};

/** Token family + weight → the loaded font's name. Display (condensed) ships in one weight. */
export function fontFamilyFor(family: TypeStyle["family"], weight: TypeStyle["weight"]): string {
  if (family === "mono") return "RobotoMono_400Regular";
  if (family === "display") return "SofiaSansCondensed_800ExtraBold";
  return SANS[weight];
}
