// phosphor-react-native 3.0.6 passes `className` to <Svg> (for NativeWind users) but
// react-native-svg 15.15 does not declare that prop, so the per-icon source imports in
// components/ui/Icon.tsx fail to type-check without this. Harmless at runtime (the prop is
// ignored). Remove once either package fixes it.
import "react-native-svg";

declare module "react-native-svg" {
  interface SvgProps {
    className?: string;
  }
}
