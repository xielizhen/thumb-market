import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { Market, State } from 'state/types'
import { fetchTotalAmountThunk, fetchStoreListThunk } from '.'
import { FETCH_STEP } from 'config'

export const useTotalAmount = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTotalAmountThunk())
  }, [dispatch])
}

export const useAddStoreList = () => {
  const dispatch = useAppDispatch()
  const { totalAmount } = useMarket()

  useEffect(() => {
    if (!totalAmount) return
    dispatch(fetchStoreListThunk(0))
  }, [dispatch, totalAmount])
}

export const useAddStoreListCb = () => {
  const dispatch = useAppDispatch()
  const { storeList, totalAmount } = useMarket()
  const currentAmount = useMemo(() => {
    return storeList.length
  }, [storeList])

  const getStoreList = useCallback(() => {
    if (currentAmount >= totalAmount) return
    dispatch(fetchStoreListThunk(currentAmount))
  }, [dispatch, currentAmount, totalAmount])
  
  return { getStoreList }
}

// 获取计算值
export const useMarket = (): Market => {
  const market = useSelector((state: State) => state.market)
  return market
}


