import { View, type StyleProp, type ViewStyle } from "react-native";

import { Mascot, mascotSize, type MascotPose } from "./Mascot";
import { MascotShadow } from "./MascotShadow";

const SHADOW_RATIO = 0.62; // shadow width ≈ 62 % of the mascot
const SHADOW_TUCK = 9; // the shadow's top sits 9 px above the mascot's feet

type Props = {
  pose: MascotPose;
  width?: number;
  style?: StyleProp<ViewStyle>;
};

/** A mascot standing on its soft ground shadow. Used by <Hero> and anywhere a mascot stands on the sky. */
export function GroundedMascot({ pose, width, style }: Props) {
  const m = mascotSize(pose, width);
  const shadowWidth = Math.round(m.width * SHADOW_RATIO);
  return (
    <View style={[{ width: m.width, height: m.height }, style]} pointerEvents="none">
      {/* shadow first so it sits behind the feet */}
      <MascotShadow
        width={shadowWidth}
        style={{ position: "absolute", left: (m.width - shadowWidth) / 2, top: m.height - SHADOW_TUCK }}
      />
      <Mascot pose={pose} width={m.width} />
    </View>
  );
}
