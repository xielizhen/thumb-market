import { MenuEntry } from './Menu/types';
import { AssetsIcon, InventoryIcon, MysteryIcon, DespoitIcon } from 'components/Svg'

const config: MenuEntry[] = [
  // {
  //   label: 'Dashboard',
  //   href: '/',
  // },
  {
    label: 'Marketplace',
    href: '/market',
  },
  {
    label: 'My Account',
    href: '/account',
    redirect: '/account/assets',
    items: [
      {
        label: 'Assets',
        href: '/account/assets',
        icon: AssetsIcon
      },
      {
        label: 'Inventory',
        href: '/account/inventory',
        icon: InventoryIcon
      },
      {
        label: 'Mystery box',
        href: '/account/mystery',
        icon: MysteryIcon
      },
      {
        label: 'Deposit',
        href: '/account/deposit',
        icon: DespoitIcon
      }
    ]
  }
]

export default config