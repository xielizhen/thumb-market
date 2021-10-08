import BigNumber from 'bignumber.js'
import multicall from 'utils/multicall'
import { Assets, FormAsset, FormAssetProperty } from 'state/types'
import { BIG_TEN } from 'utils/bigNumber'
import UtilIcon from 'utils/icon'

import erc20ABI from 'config/abi/erc20.json'
import BitBowNFTAbi from 'config/abi/BitBowNFT.json'
import BitBowRepositoryAbi from 'config/abi/BitBowRepository.json'
import { getArrowAddress, getBitBowNFTAddress, getBitBowRepositoryAddress, getTargetAddress } from 'utils/addressHelpers'
import { getBitBowNFTContract, getBitBowRepositoryContract } from 'utils/contractHelpers'
import { IMG_BASE_URL } from 'config'
import { IAccountRes, getThumbAccount } from 'services/api'

/**
 * 根据id获取物品的属性和图片
 * @param id 
 * @returns 
 */
export const fetchPropertiesById = async (id: string): Promise<FormAssetProperty> => {
  // 根据id获取到该物品的属性
  const item = await getBitBowRepositoryContract().methods.get(id).call()
  // 生成用户图片
  return dealProperties(id, +item.form, item.properties)
}

/**
 * 规范化用户图片和属性
 * @param account 
 * @returns 
 */
export const dealProperties = (id: string, type: number, properties: string[]): FormAssetProperty => {
  // 生成用户图片
  const property = UtilIcon.PropertyRule(id, type, properties)
  const url = UtilIcon.CalcIcon(type, property.properties.model, property.properties.color1, property.properties.color2, property.properties.color3)
  const unShowAttributes = ['mode', 'color1', 'color2', 'color3']
  const displayProperties = Object.keys(property.properties).reduce((acc, curr) => {
    if (!unShowAttributes.includes(curr)) acc[curr] = property.properties[curr]
    return acc
  }, {})
  const asset = {
    ...property,
    displayProperties,
    imgSrc: `${IMG_BASE_URL}${url}`
  }
  return asset
}

/**
 * 获取用户的arrow、target等asset
 * @param account 
 * @returns 
 */
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

/**
 * 获取用户对应的弓、剑、放大镜和护具等asset
 * @param account 
 * @returns 
 */
export const fetchFormAssets = async (account: string): Promise<FormAsset[]> => {
  // 获取该地址名下有几个nft
  const nftNum = await getBitBowNFTContract().methods.balanceOf(account).call()

  // 获取所有ID
  const idCalls = new Array(+nftNum).fill(0).map((item, index) => ({
    address: getBitBowNFTAddress(),
    name: 'tokenOfOwnerByIndex',
    params: [account, index],
  }))
  const idResults = await multicall(BitBowNFTAbi, idCalls)

  // 获取所有id对应的属性
  const propertyCalls = idResults.map((item, index) => ({
    address: getBitBowRepositoryAddress(),
    name: 'get',
    params: [new BigNumber(item).toNumber()]
  }))
  const propertyResults = await multicall(BitBowRepositoryAbi, propertyCalls)
  
  // 数据处理
  const res = propertyResults.reduce((acc, curr, index) => {
    const asset = dealProperties(new BigNumber(idResults[index]).toString(), +curr.form, curr.properties) 
    const idx = acc.findIndex(o => o.type === asset.type)
    if (idx > -1) {
      acc[idx].assets = acc[idx].assets.concat(asset)
    } else {
      acc.push({
        type: asset.type,
        assets: [asset]
      })
    }
    return acc
  }, [])

  return res
}


export const fetchUserInfo = async (account: string): Promise<IAccountRes> => {
  const data = await getThumbAccount(account)
  return data
}


