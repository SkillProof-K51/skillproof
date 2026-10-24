import { colors } from "@skillproof/tokens";
import { ArrowClockwise } from "phosphor-react-native/src/icons/ArrowClockwise";
import { ArrowRight } from "phosphor-react-native/src/icons/ArrowRight";
import { Briefcase } from "phosphor-react-native/src/icons/Briefcase";
import { CaretDown } from "phosphor-react-native/src/icons/CaretDown";
import { CaretLeft } from "phosphor-react-native/src/icons/CaretLeft";
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
import { EyeSlash } from "phosphor-react-native/src/icons/EyeSlash";
import { House } from "phosphor-react-native/src/icons/House";
import { IdentificationCard } from "phosphor-react-native/src/icons/IdentificationCard";
import { Info } from "phosphor-react-native/src/icons/Info";
import { Lightbulb } from "phosphor-react-native/src/icons/Lightbulb";
import { Lightning } from "phosphor-react-native/src/icons/Lightning";
import { Lock } from "phosphor-react-native/src/icons/Lock";
import { LockOpen } from "phosphor-react-native/src/icons/LockOpen";
import { Microphone } from "phosphor-react-native/src/icons/Microphone";
import { Plant } from "phosphor-react-native/src/icons/Plant";
import { QrCode } from "phosphor-react-native/src/icons/QrCode";
import { Play } from "phosphor-react-native/src/icons/Play";
import { ShareNetwork } from "phosphor-react-native/src/icons/ShareNetwork";
import { Sparkle } from "phosphor-react-native/src/icons/Sparkle";
import { TestTube } from "phosphor-react-native/src/icons/TestTube";
import { User } from "phosphor-react-native/src/icons/User";
import { Warning } from "phosphor-react-native/src/icons/Warning";
import { X } from "phosphor-react-native/src/icons/X";
import { XCircle } from "phosphor-react-native/src/icons/XCircle";

// Phosphor (MIT), 24 px grid — the Figma `icon/*` set plus the few the kit needed since, keyed by
// the Figma name. Per-icon imports keep the bundle to the icons we use (the package index is 500 KB).
const ICONS = {
  home: House,
  zap: Lightning,
  briefcase: Briefcase,
  "id-card": IdentificationCard,
  user: User,
  mail: Envelope,
  lock: Lock,
  eye: Eye,
  "eye-off": EyeSlash,
  check: Check,
  "chevron-right": CaretRight,
  "chevron-left": CaretLeft,
  "chevron-down": CaretDown,
  clock: Clock,
  seedling: Plant,
  share: ShareNetwork,
  alert: Warning,
  info: Info,
  x: X,
  play: Play,
  bug: Bug,
  database: Database,
  message: ChatCircle,
  mic: Microphone,
  "x-circle": XCircle,
  "check-circle": CheckCircle,
  compass: Compass,
  unlock: LockOpen, // a micro-project just opened (Result)
  retry: ArrowClockwise, // try a challenge again
  hint: Lightbulb, // a hint after a missed check
  ai: Sparkle, // AI feedback — always with a label saying it's AI
  qr: QrCode, // show the passport's QR code
  // skills without a logo (SkillLogo falls back to these)
  test: TestTube,
  chart: ChartBar,
  "arrow-right": ArrowRight, // "See all →", "Up next →" on the dark progress card
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
