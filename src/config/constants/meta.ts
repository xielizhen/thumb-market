import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Shrimp',
  description: 'The Shrimp Protocol is a community driven,fair launched DeFi Token',
  image: '',
}

export const customMeta: { [key: string]: PageMeta } = {
  '/': {
    title: 'Shrimp',
  },
  '/account': {
    title: 'Shrimp account',
  },
}
