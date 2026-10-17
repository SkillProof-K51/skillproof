import { Image, type ImageStyle } from "expo-image";
import type { StyleProp } from "react-native";

// Ten still poses of the flat 2D mascot (Azim's own ChatGPT generation, 18 Oct; replaced the 3D
// fluffy one), cut out of assets/mascot-sheet-source.png onto transparency. Sizes = each image's
// aspect ratio at 120 px tall. To upgrade a pose, drop a sharper transparent PNG with the same
// file name into assets/mascot/ and update its width here. Reference look: assets/mascot-reference.png.
const POSES = {
  wave: { source: require("../../assets/mascot/wave.png"), width: 140, height: 120 },
  happy: { source: require("../../assets/mascot/happy.png"), width: 154, height: 120 },
  question: { source: require("../../assets/mascot/question.png"), width: 135, height: 120 },
  idea: { source: require("../../assets/mascot/idea.png"), width: 149, height: 120 },
  checklist: { source: require("../../assets/mascot/checklist.png"), width: 142, height: 120 },
  celebrate: { source: require("../../assets/mascot/celebrate.png"), width: 147, height: 120 },
  graduate: { source: require("../../assets/mascot/graduate.png"), width: 138, height: 120 },
  laptop: { source: require("../../assets/mascot/laptop.png"), width: 147, height: 120 },
  reading: { source: require("../../assets/mascot/reading.png"), width: 135, height: 120 },
  sleep: { source: require("../../assets/mascot/sleep.png"), width: 159, height: 120 },
} as const;

export type MascotPose = keyof typeof POSES;

/** Rendered size of a pose at a given width (height follows the pose's aspect ratio). */
export function mascotSize(pose: MascotPose, width?: number): { width: number; height: number } {
  const p = POSES[pose];
  const w = width ?? p.width;
  return { width: w, height: Math.round((w * p.height) / p.width) };
}

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
  const { width: w, height: h } = mascotSize(pose, width);
  return (
    <Image
      source={POSES[pose].source}
      accessible={false}
      contentFit="contain"
      style={[{ width: w, height: h }, style]}
    />
  );
}
