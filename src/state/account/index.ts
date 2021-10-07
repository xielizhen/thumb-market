import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { BitBowTypeEnum } from 'utils/icon'
import { Account, Assets, FormAsset, FormAssetProperty } from '../types'
import { fetchAssets, fetchFormAssets } from './fetch'

const initialState: Account = {
  assets: {
    arrowNum: 0,
    targetNum: 0,
    BNBNum: 0
  },
  formAssets: []
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    updateAssets: (state, action: PayloadAction<Assets>) => {
      state.assets = {
        ...state.assets,
        ...action.payload
      }
    },
    addFormAssets: (state, action: PayloadAction<FormAsset[]>) => {
      state.formAssets = action.payload
    },
    updateFormAssets: (state, action: PayloadAction<FormAssetProperty>) => {
      console.log(action.payload)
    }
  },
})

// Actions
export const { updateAssets, addFormAssets, updateFormAssets } = accountSlice.actions

// Thunks
export const fetchAssetsThunk = (account: string) => async (dispatch: Dispatch) => {
  try {
    const data = await fetchAssets(account)
    dispatch(updateAssets(data))
  } catch (error) {
    console.error(error)
  }
}
export const fetchFormAssetsThunk = (account: string) => async (dispath: Dispatch) => {
  try {
    const data = await fetchFormAssets(account)
    dispath(addFormAssets(data))
  } catch (error) {
    console.error(error)
  }
}

export default accountSlice.reducer
