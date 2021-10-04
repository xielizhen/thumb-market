export interface MenuEntry {
  label: string;
  icon?: string;
  items?: MenuEntry[];
  href: string;
  redirect?: string;
  calloutClass?: string;
}