import { ChainId } from './types'
import BigNumber from 'bignumber.js'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const BSC_BLOCK_TIME = 3

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: 'https://bscscan.com',
  [ChainId.TESTNET]: 'https://testnet.bscscan.com',
}

export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[ChainId.MAINNET]
export const IMG_BASE_URL = 'https://bitbow.s3.ap-southeast-1.amazonaws.com/res/icons/'
export const GAME_ADDRESS = '0x5bD790d42777B52Fe7C19BF4021820DEb139332A'
export const MAX_UNIT_256 = new BigNumber(2).pow(256).minus(1);
export const FETCH_STEP = 2
