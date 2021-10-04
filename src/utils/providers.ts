import getRpcUrl from 'utils/getRpcUrl'
import Web3 from 'web3'
import { HttpProviderOptions } from 'web3-core-helpers'

const RPC_URL = getRpcUrl()
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 } as HttpProviderOptions)

export const web3NoAccount = new Web3(httpProvider)
export const getWeb3NoAccount = () => {
  return web3NoAccount
}
