import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { FormAssetProperty, Market, StoreAsset } from 'state/types';
import { cloneDeep } from 'lodash';

import { fetchStoreList, fetchTotalAmount } from './fetch';

const initialState: Market = {
  totalAmount: 0,
  currentAmount: 0,
  storeList: []
}

export const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    updateTotalAmount: (state, action: PayloadAction<number>) => {
      state.totalAmount = action.payload
    },
    updateCurrentAmount: (state, action: PayloadAction<number>) => {
      state.currentAmount = action.payload
    },
    addStoreList: (state, action: PayloadAction<StoreAsset[]>) => {
      state.storeList = state.storeList.concat(action.payload)
    },
    updateStoreList: (state, action: PayloadAction<FormAssetProperty>) => {
      const storeList = cloneDeep(state.storeList)
      const idx = state.storeList.findIndex(o => o.id === action.payload.id)
      if (idx > -1) {
        storeList.splice(idx, 1, action.payload)
      }
      state.storeList = storeList
    },
    deleteStoreList: (state, action: PayloadAction<string>) => {
      const storeList = cloneDeep(state.storeList)
      const idx = state.storeList.findIndex(o => o.id === action.payload)
      if (idx > -1) {
        storeList.splice(idx, 1)
      }
      state.storeList = storeList
    },
  },
})

// Actions
export const {
  updateTotalAmount,
  updateCurrentAmount,
  addStoreList,
  updateStoreList,
  deleteStoreList
} = marketSlice.actions

// Thunks
export const fetchTotalAmountThunk = () => async (dispatch: Dispatch) => {
  try {
    const data = await fetchTotalAmount()
    dispatch(updateTotalAmount(data))
  } catch (error) {
    console.error(error)
  }
}

export const fetchStoreListThunk = (idx: number) => async (dispatch: Dispatch) => {
  try {
    const data = await fetchStoreList(idx)
    dispatch(addStoreList(data))
  } catch (error) {
    console.error(error)
  }
}


export default marketSlice.reducer
