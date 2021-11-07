import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import { FormAssetProperty } from 'state/types';
import { useAccount, useAddFormAssets } from 'state/account/hooks';
import EquimentItem from 'components/EquimentItem';
import ConfirmBtn, { EnumBtnType } from 'components/ConfirmBtn';

import CorrectIcon from 'assets/correct.webp';
import SellModal from '../SellModal';
import SynthesizeModal from '../SynthesizeModal';
import styles from './index.module.scss';
import { BitBowTypeEnum, EnumQuality } from 'utils/icon';

const cx = classNames.bind(styles)

interface IProps {
  assets: FormAssetProperty[]
}
export interface ICheckedItem extends FormAssetProperty {
  checked: boolean,
  disabled: boolean
}
const InventoryTab: React.FC<IProps> = ({ assets }) => {
  const { formAssets } = useAccount()
  const { updateFormAssets } = useAddFormAssets();
  const [checkboxList, setcheckboxList] = useState<ICheckedItem[]>([])
  const [sellModalVisible, setSellModalVisible] = useState(false)
  const [syntheModalVisible, setSyntheModalVisible] = useState(false)

  const totalEquiments = useMemo(() => {
    return formAssets.reduce((curr, prev) => {
      return curr + prev.assets.length
    }, 0)
  }, [formAssets])


  const checkedList = useMemo(() => {
    return checkboxList.filter(o => o.checked)
  }, [checkboxList])

  const synthesizeBtnDisabled = useMemo(() => {
    if (checkedList.length !== 3) return true
    const qualityList = [...new Set(checkedList.map(o => o.displayProperties.quality))]
    if (qualityList.length !== 1) return true
    if (qualityList[0] === EnumQuality.SSR) return true
    return false
  }, [checkedList])

  const handleCheckedChange = (checked: boolean, asset: FormAssetProperty) => {
    // const quality = checkedList.length ? checkedList[0].properties.quality : asset.properties.quality
    // const isLast = !checked && checkedList.length === 1
    // const overMax = checked && checkedList.length === 2

    const list = checkboxList.map((o) => {
      if (o.id === asset.id) {
        return {
          ...o,
          checked: !checked
        }
      } else {
        return {
          ...o,
          // disabled: (!isLast && o.properties.quality !== quality) || (overMax && !o.checked)
        }
      }
    })
    setcheckboxList(list)
  }

  const handleSellClick = () => {
    setSellModalVisible(true)
  }

  const handleSyntheClick = () => {
    setSyntheModalVisible(true)
  }

  useEffect(() => {
    const data: ICheckedItem[] = assets.map(o => ({
      checked: false,
      disabled: false,
      // disabled: o.properties.quality >= 1,
      ...o,
    }))
    setcheckboxList(data)
  }, [assets])


  return (
    <div className={cx('inventory-tab')}>
      <div className={cx('header')}>
        <div className={cx('info')}>{totalEquiments} Items</div>
        <div className={cx('btn-group')}>
          <ConfirmBtn
            title='Sell'
            btnType={EnumBtnType.SMALL}
            disabled={checkedList.length !== 1}
            onClick={handleSellClick}
          />
          <ConfirmBtn
            title='Synthesize'
            style={{ marginLeft: '16px' }}
            btnType={EnumBtnType.SMALL}
            disabled={synthesizeBtnDisabled}
            onClick={handleSyntheClick}
          />
        </div>
      </div>
      <div className={cx('panels')}>
        {
          assets.map((tab) => {
            const item = checkboxList.find(o => o.id === tab.id)
            const checked = item?.checked
            const disabled = item?.disabled
            return (
              <div
                className={cx('panel', { active: checked, disabled })}
                key={tab.id}
                onClick={() => handleCheckedChange(checked, tab)}
              >
                <EquimentItem
                  type={tab.type}
                  quality={tab.displayProperties.quality}
                  imgUrl={tab.imgSrc}
                  properties={tab.displayProperties}
                />
                {checked &&
                  <img
                    className={cx('correct-img')}
                    src={CorrectIcon}
                    alt="correct"
                  />
                }
              </div>
            )
          })
        }
      </div>
      <SellModal
        visible={sellModalVisible}
        asset={checkedList[0]}
        onCancel={() => setSellModalVisible(false)}
      />
      {
        syntheModalVisible && (
          <SynthesizeModal
            visible={syntheModalVisible}
            checkedList={checkedList}
            onCancel={() => {
              setSyntheModalVisible(false)
              updateFormAssets()
            }}
          />
        )
      }
    </div>
  )
}

export default InventoryTab