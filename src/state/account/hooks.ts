import { useWeb3React } from '@web3-react/core'
import useWeb3 from 'hooks/useWeb3'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { Account, State } from 'state/types'
import BigNumber from 'bignumber.js'
import { fetchAssetsThunk, fetchFormAssetsThunk, updateAssets } from '.'
import { BIG_TEN } from 'utils/bigNumber'

export const useAllAssets = () => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React();
  const web3 = useWeb3()

  useEffect(() => {
    if (account) {
      dispatch(fetchAssetsThunk(account))
      dispatch(fetchFormAssetsThunk(account))
      web3.eth.getBalance(account).then(res => {
        dispatch(updateAssets({
          BNBNum: new BigNumber(res).div(BIG_TEN.pow(18)).toNumber()
        }))
      })
    }
  }, [dispatch, account, web3])
}

// 获取计算值
export const useAccount = (): Account => {
  const account = useSelector((state: State) => state.account)
  return account
}


