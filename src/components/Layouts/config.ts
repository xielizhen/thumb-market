import { MenuEntry } from './Menu/types'

import assetsIcon from 'assets/assets.webp'
import inventoryIcon from 'assets/inventory.webp'
import mysteryIcon from 'assets/mystery.webp'
import depositIcon from 'assets/deposit.webp'

const config: MenuEntry[] = [
  {
    label: 'Dashboard',
    href: '/',
  },
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
        icon: assetsIcon
      },
      {
        label: 'Inventory',
        href: '/account/inventory',
        icon: inventoryIcon
      },
      {
        label: 'Mystery box',
        href: '/account/mystery',
        icon: mysteryIcon
      },
      {
        label: 'Deposit',
        href: '/account/deposit',
        icon: depositIcon
      }
    ]
  }
]

export default config