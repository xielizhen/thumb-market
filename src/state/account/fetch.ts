import BigNumber from 'bignumber.js'
import multicall from 'utils/multicall'
import { Assets, FormAsset } from 'state/types'
import { BIG_TEN } from 'utils/bigNumber'
import UtilIcon from 'utils/icon'

import erc20ABI from 'config/abi/erc20.json'
import { getArrowAddress, getTargetAddress } from 'utils/addressHelpers'
import { getBitBowNFTContract, getBitBowRepositoryContract } from 'utils/contractHelpers'

export const fetchAssets = async (account: string): Promise<Assets> => {
  const calls = [
    {
      address: getArrowAddress(),
      key: 'arrowNum',
      name: 'balanceOf',
      params: [account]
    },
    {
      address: getTargetAddress(),
      key: 'targetNum',
      name: 'balanceOf',
      params: [account]
    }
  ]

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).div(BIG_TEN.pow(18)).toNumber()
  })

  return {
    arrowNum: new BigNumber(parsedLpAllowances[0]).toNumber(),
    targetNum: new BigNumber(parsedLpAllowances[1]).toNumber()
  }
}

export const fetchFormAssets = async (account: string): Promise<FormAsset[]> => {
  // 获取该地址名下有几个nft
  const nftNum = await getBitBowNFTContract().methods.balanceOf(account).call()

  const res = []
  for (let i = 0 ; i < +nftNum; i++) {
    try {
      // 根据序列号把每一个nft的id获取到
      const id = await getBitBowNFTContract().methods.tokenOfOwnerByIndex(account, i).call()
      // 根据id获取到该物品的属性
      const item = await getBitBowRepositoryContract().methods.get(id).call()
      const property = UtilIcon.PropertyRule(id, +item.form, item.properties)
      const idx = res.findIndex(o => o.type === property.type)
      if (idx > -1) {
        res[idx].assets = res[idx].assets.push(property)
      } else {
        res.push({
          type: property.type,
          assets: [property]
        })
      }
    } catch (err) {
      console.error(err)
    }
  }
  return res
}


