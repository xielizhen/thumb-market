import BigNumber from 'bignumber.js'

export const BIG_ZERO = new BigNumber(0)
export const BIG_TEN = new BigNumber(10)

export const transferNumToBUnit = (num: BigNumber | number): number => {
  return new BigNumber(num).div(BIG_TEN.pow(9)).toNumber()
}

export const transferNumToTUnit = (num: BigNumber | number): number => {
  return new BigNumber(num).div(BIG_TEN.pow(12)).toNumber()
}
