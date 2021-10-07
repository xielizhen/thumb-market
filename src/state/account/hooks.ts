import { useWeb3React } from '@web3-react/core'
import useWeb3 from 'hooks/useWeb3'
import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { Account, FormAssetProperty, State } from 'state/types'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { fetchAssetsThunk, fetchFormAssetsThunk, updateAssets, updateFormAssets } from '.'

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

export const useUpdateFormAssets = () => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const web3 = useWeb3()
  const handleUpdateFormAsset = useCallback(async (asset: FormAssetProperty) => {
    dispatch(updateFormAssets(asset))
  }, [account, dispatch, web3])

  return { handleUpdateFormAsset }
}

// 获取计算值
export const useAccount = (): Account => {
  const account = useSelector((state: State) => state.account)
  return account
}

