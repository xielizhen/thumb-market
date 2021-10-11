import BigNumber from 'bignumber.js'
import { getBitBowStoreAddress } from 'utils/addressHelpers'
import { getBitBowNFTContract } from 'utils/contractHelpers'
import BitBowStoreAbi from 'config/abi/BitBowStore.json'

import multicall from 'utils/multicall'
import { StoreAsset } from 'state/types'
import { getPropertiesByIds } from 'state/account/fetch'
import { FETCH_STEP } from 'config'

export const fetchTotalAmount = async () :Promise<number> => {
  const data = await getBitBowNFTContract().methods.balanceOf(getBitBowStoreAddress()).call()
  return +data
}

export const fetchStoreList = async (idx: number): Promise<StoreAsset[]> => {
  const account = getBitBowStoreAddress()
  const data = await getPropertiesByIds(account, idx, idx + FETCH_STEP)

  // 获取所有id对应的属性
  const priceCalls = data.map((item, index) => ({
    address: getBitBowStoreAddress(),
    name: 'getNFT',
    params: [new BigNumber(item.id).toNumber()]
  }))
  const priceResults = await multicall(BitBowStoreAbi, priceCalls)

  return data.map((item, index) => ({
    ...item,
    price: priceResults[index][0].toNumber(),
    owner: priceResults[index][1]
  }))
}


