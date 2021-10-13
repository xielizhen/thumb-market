import { useCallback, useEffect } from "react"
import { getPropertiesByIds } from "state/account/fetch"
import { getBitBowStoreAddress } from "utils/addressHelpers"
import { getBitBowNFTContract } from "utils/contractHelpers"
import multicall from "utils/multicall"
import BigNumber from 'bignumber.js'
import { FETCH_STEP } from "config"
import BitBowStoreAbi from 'config/abi/BitBowStore.json'
import { useSafeState } from "ahooks"
import { StoreAsset } from "state/types"
import { cloneDeep } from 'lodash'

const useTotalAmount = () => {
  const [totalAmount, setTotalAmount] = useSafeState(0)

  const fetchTotalAmount = useCallback(async () => {
    const data = await getBitBowNFTContract().methods.balanceOf(getBitBowStoreAddress()).call()
    setTotalAmount(+data)
  }, [])

  useEffect(() => {
    fetchTotalAmount()
  }, [])

  return {
    totalAmount,
    setTotalAmount,
    fetchTotalAmount
  }
}

const useStoreList = () => {
  const [storeList, setStoreList] = useSafeState<StoreAsset[]>([])

  const deleteStoreByTokenId = useCallback(async (id: string) => {
    const idx = storeList.findIndex(o => +o.id === +id)
    if (idx > -1) {
      const list = cloneDeep(storeList)
      list.splice(idx, 1)
      setStoreList(list)
    }
  }, [storeList])

  
  const fetchStoreList = useCallback(async (totalAmount: number) => {
    const account = getBitBowStoreAddress()

    const ids = storeList.map(o => o.id)
    const beginIdx= storeList.length ? storeList.length : 0
    const endIdx = beginIdx + FETCH_STEP
    const data = await getPropertiesByIds(account, beginIdx, endIdx > totalAmount ? totalAmount : endIdx)

    // 获取所有id对应的属性
    const priceCalls = data.map((item, index) => ({
      address: getBitBowStoreAddress(),
      name: 'getNFT',
      params: [new BigNumber(item.id).toNumber()]
    }))
    const priceResults = await multicall(BitBowStoreAbi, priceCalls)

    const res = data
      .filter(o => !ids.includes(o.id))
      .map((item, index) => ({
      ...item,
      price: priceResults[index][0].toNumber(),
      owner: priceResults[index][1]
    }))

    setStoreList(storeList.concat(res))
  }, [storeList])

  return {
    storeList,
    fetchStoreList,
    deleteStoreByTokenId
  }
}

export {
  useTotalAmount,
  useStoreList
}