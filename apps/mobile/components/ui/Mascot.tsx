import { Image, type ImageStyle } from "expo-image";
import type { StyleProp } from "react-native";

// Ten still poses of the flat 2D mascot — Azim's own ChatGPT generations (18 Oct), one pose per
// image at 1254 px with a transparent background, trimmed and scaled to 720 px (sharp up to ~240 px
// on a 3× phone). Prompt: "Same character and same flat 2D style as the attached reference …
// Pose: <pose>. Full body, centred, transparent background, no ground shadow, no words", with
// assets/mascot-reference.png attached. Sizes = each image's aspect ratio at 120 px tall.
const POSES = {
  wave: { source: require("../../assets/mascot/wave.png"), width: 141, height: 120 },
  happy: { source: require("../../assets/mascot/happy.png"), width: 145, height: 120 },
  question: { source: require("../../assets/mascot/question.png"), width: 123, height: 120 },
  idea: { source: require("../../assets/mascot/idea.png"), width: 146, height: 120 },
  checklist: { source: require("../../assets/mascot/checklist.png"), width: 127, height: 120 },
  celebrate: { source: require("../../assets/mascot/celebrate.png"), width: 123, height: 120 },
  graduate: { source: require("../../assets/mascot/graduate.png"), width: 123, height: 120 },
  laptop: { source: require("../../assets/mascot/laptop.png"), width: 123, height: 120 },
  reading: { source: require("../../assets/mascot/reading.png"), width: 117, height: 120 },
  sleep: { source: require("../../assets/mascot/sleep.png"), width: 139, height: 120 },
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
 * Rule (docs/ui.md): one mascot on a module's first screen — in the Hero or standing on the sheet
 * edge (SectionHeader) — at most one more inside a card. Never on the filled Skill Passport or on
 * task screens (Fix the bug, SQL live, Explain it).
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
