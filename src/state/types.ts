import { IAccountRes } from 'services/api'
import { BitBowTypeEnum, IPropertiesRule } from 'utils/icon'
// assets
export interface Assets {
  arrowNum?: number
  targetNum?: number
  BNBNum?: number
}

export interface FormAssetProperty extends IPropertiesRule {
  imgSrc: string,
  displayProperties: {
    [key: string]: any
  } 
}

export interface FormAsset {
  type: BitBowTypeEnum,
  assets: FormAssetProperty[]
}

// account
export type Account = {
  assets: Assets,
  formAssets?: FormAsset[],
  userInfo: IAccountRes
}

export interface State {
  account: Account
}
