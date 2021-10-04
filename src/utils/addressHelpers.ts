import addresses from 'config/constants/contracts'
import { Address } from 'config/constants/types'

export const getAddress = (address: Address): string => {
  const mainNetChainId = 56
  const chainId = process.env.REACT_APP_CHAIN_ID
  return address[chainId] ? address[chainId] : address[mainNetChainId]
}

export const getBitBowFactoryAddress = () => {
  return getAddress(addresses.BitBowFactory)
}

export const getBitBowRepositoryAddress = () => {
  return getAddress(addresses.BitBowRepository)
}

export const getBitBowNFTAddress = () => {
  return getAddress(addresses.BitBowNFT)
}


export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall)
}
