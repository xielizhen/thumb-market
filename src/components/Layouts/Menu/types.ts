import { FC } from "react";
import { SvgProps } from "components/Svg/types";
export interface MenuEntry {
  label: string;
  icon?:  FC<SvgProps>;
  items?: MenuEntry[];
  href: string;
  redirect?: string;
  calloutClass?: string;
}