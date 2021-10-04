export interface MenuEntry {
  label: string;
  icon?: string;
  items?: MenuEntry[];
  href: string;
  calloutClass?: string;
}