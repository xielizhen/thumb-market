import { web3NoAccount } from 'utils/providers'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'

// adresses
import {
  getBitBowFactoryAddress,
  getBitBowNFTAddress,
  getBitBowRepositoryAddress,
  getTargetAddress,
  getArrowAddress,
  getBitBowStoreAddress,
} from 'utils/addressHelpers'

// abi
import BitBowFactoryAbi from 'config/abi/BitBowFactory.json'
import BitBowNFTAbi from 'config/abi/BitBowNFT.json'
import BitBowRepositoryAbi from 'config/abi/BitBowRepository.json'
import Erc20Abi from 'config/abi/erc20.json'
import StoreAbi from 'config/abi/BitBowStore.json'

const getContract = (abi: any, address: string, web3?: Web3) => {
  const _web3 = web3 ?? web3NoAccount
  return new _web3.eth.Contract(abi as unknown as AbiItem, address)
}

export const getBitBowFactoryContract = (web3?: Web3) => {
  return getContract(BitBowFactoryAbi, getBitBowFactoryAddress(), web3)
}

export const getBitBowNFTContract = (web3?: Web3) => {
  return getContract(BitBowNFTAbi, getBitBowNFTAddress(), web3)
}

export const getBitBowRepositoryContract = (web3?: Web3) => {
  return getContract(BitBowRepositoryAbi, getBitBowRepositoryAddress(), web3)
}

export const getArrowContract = (web3?: Web3) => {
  return getContract(Erc20Abi, getArrowAddress(), web3)
}

export const getTargetContract = (web3?: Web3) => {
  return getContract(Erc20Abi, getTargetAddress(), web3)
}

export const getStoreContract = (web3?: Web3) => {
  return getContract(StoreAbi, getBitBowStoreAddress(), web3)
}
