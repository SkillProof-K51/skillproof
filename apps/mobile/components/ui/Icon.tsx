import { colors } from "@skillproof/tokens";
import { Briefcase } from "phosphor-react-native/src/icons/Briefcase";
import { Bug } from "phosphor-react-native/src/icons/Bug";
import { CaretRight } from "phosphor-react-native/src/icons/CaretRight";
import { ChartBar } from "phosphor-react-native/src/icons/ChartBar";
import { ChatCircle } from "phosphor-react-native/src/icons/ChatCircle";
import { Check } from "phosphor-react-native/src/icons/Check";
import { CheckCircle } from "phosphor-react-native/src/icons/CheckCircle";
import { Clock } from "phosphor-react-native/src/icons/Clock";
import { Compass } from "phosphor-react-native/src/icons/Compass";
import { Database } from "phosphor-react-native/src/icons/Database";
import { Envelope } from "phosphor-react-native/src/icons/Envelope";
import { Eye } from "phosphor-react-native/src/icons/Eye";
import { House } from "phosphor-react-native/src/icons/House";
import { IdentificationCard } from "phosphor-react-native/src/icons/IdentificationCard";
import { Lightning } from "phosphor-react-native/src/icons/Lightning";
import { Lock } from "phosphor-react-native/src/icons/Lock";
import { Microphone } from "phosphor-react-native/src/icons/Microphone";
import { Plant } from "phosphor-react-native/src/icons/Plant";
import { Play } from "phosphor-react-native/src/icons/Play";
import { ShareNetwork } from "phosphor-react-native/src/icons/ShareNetwork";
import { TestTube } from "phosphor-react-native/src/icons/TestTube";
import { User } from "phosphor-react-native/src/icons/User";
import { Warning } from "phosphor-react-native/src/icons/Warning";
import { X } from "phosphor-react-native/src/icons/X";
import { XCircle } from "phosphor-react-native/src/icons/XCircle";

// Phosphor (MIT), 24 px grid — the same 23 glyphs as the Figma `icon/*` set, keyed by the
// Figma name. Per-icon imports keep the bundle to the icons we use (the package index is 500 KB).
const ICONS = {
  home: House,
  zap: Lightning,
  briefcase: Briefcase,
  "id-card": IdentificationCard,
  user: User,
  mail: Envelope,
  lock: Lock,
  eye: Eye,
  check: Check,
  "chevron-right": CaretRight,
  clock: Clock,
  seedling: Plant,
  share: ShareNetwork,
  alert: Warning,
  x: X,
  play: Play,
  bug: Bug,
  database: Database,
  message: ChatCircle,
  mic: Microphone,
  "x-circle": XCircle,
  "check-circle": CheckCircle,
  compass: Compass,
  // skills without a logo (SkillLogo falls back to these)
  test: TestTube,
  chart: ChartBar,
} as const;

export type IconName = keyof typeof ICONS;
export type IconWeight = "regular" | "duotone" | "bold" | "fill";

type Props = {
  name: IconName;
  size?: number;
  /** Regular = default state; Duotone = active / tile badges (Figma rule). */
  weight?: IconWeight;
  color?: string;
};

export function Icon({ name, size = 24, weight = "regular", color = colors.icon.default }: Props) {
  const Glyph = ICONS[name];
  return <Glyph size={size} weight={weight} color={color} />;
}
