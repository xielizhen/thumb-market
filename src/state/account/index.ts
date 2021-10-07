import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { IAccountRes } from 'services/api'
import { Account, Assets, FormAsset, FormAssetProperty } from '../types'
import { fetchAssets, fetchFormAssets, fetchUserInfo } from './fetch'

const initialState: Account = {
  assets: {
    arrowNum: 0,
    targetNum: 0,
    BNBNum: 0
  },
  formAssets: [],
  userInfo: {
    username: '',
    name: '',
    gold: 0,
    isRegister: false
  }
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
    },
    updateUserInfo: (state, action: PayloadAction<IAccountRes>) => {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload
      }
    }
  },
})

// Actions
export const {
  updateAssets,
  addFormAssets,
  updateFormAssets,
  updateUserInfo
} = accountSlice.actions

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

export const fetchUserInfoThunk = (account: string) => async (dispatch: Dispatch) => {
  try {
    const data = await fetchUserInfo(account)
    dispatch(updateUserInfo(data))
  } catch (error) {
    console.error(error)
  }
}


export default accountSlice.reducer
