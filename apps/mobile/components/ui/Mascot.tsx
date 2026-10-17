import { Image, type ImageStyle } from "expo-image";
import type { StyleProp } from "react-native";

// Ten still poses cropped from Azim's mascot sheet (assets/mascot-sheet-source.png) with the
// exact crop boxes the Figma `Mascot` component uses. Sizes = the Figma component boxes at 1×.
const POSES = {
  wave: { source: require("../../assets/mascot/wave.png"), width: 129, height: 120 },
  happy: { source: require("../../assets/mascot/happy.png"), width: 144, height: 120 },
  question: { source: require("../../assets/mascot/question.png"), width: 143, height: 120 },
  idea: { source: require("../../assets/mascot/idea.png"), width: 143, height: 120 },
  checklist: { source: require("../../assets/mascot/checklist.png"), width: 131, height: 120 },
  celebrate: { source: require("../../assets/mascot/celebrate.png"), width: 152, height: 120 },
  graduate: { source: require("../../assets/mascot/graduate.png"), width: 121, height: 120 },
  laptop: { source: require("../../assets/mascot/laptop.png"), width: 141, height: 120 },
  reading: { source: require("../../assets/mascot/reading.png"), width: 130, height: 120 },
  sleep: { source: require("../../assets/mascot/sleep.png"), width: 142, height: 120 },
} as const;

export type MascotPose = keyof typeof POSES;

type Props = {
  pose?: MascotPose;
  /** Rendered width; height follows the pose's aspect ratio. Default = Figma size. */
  width?: number;
  style?: StyleProp<ImageStyle>;
};

/**
 * Rule (docs/ui.md): one hero mascot on a module's first screen, at most one more inside a
 * card. Never on the filled Skill Passport or on task screens (Fix the bug, SQL live, Explain it).
 */
export function Mascot({ pose = "wave", width, style }: Props) {
  const p = POSES[pose];
  const w = width ?? p.width;
  const h = Math.round((w * p.height) / p.width);
  return (
    <Image
      source={p.source}
      accessible={false}
      contentFit="contain"
      style={[{ width: w, height: h }, style]}
    />
  );
}
