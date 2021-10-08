import React, { useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, notification, Tooltip } from 'antd';
import classNames from 'classnames/bind';
import { FormAssetProperty } from 'state/types';
import { InfoCircleFilled } from '@ant-design/icons';

import SellModal from '../SellModal';
import SynthesizeModal from '../SynthesizeModal';
import styles from './index.module.scss';
import { useAddFormAssets } from 'state/account/hooks';

const cx = classNames.bind(styles)

interface IProps {
  assets: FormAssetProperty[]
}
export interface ICheckedItem extends FormAssetProperty {
  checked: boolean,
  disabled: boolean
}
const InventoryTab: React.FC<IProps> = ({ assets }) => {
  const { updateFormAssets } = useAddFormAssets();
  const [checkboxList, setcheckboxList] = useState<ICheckedItem[]>([])
  const [sellModalVisible, setSellModalVisible] = useState(false)
  const [syntheModalVisible, setSyntheModalVisible] = useState(false)
  const [currentAsset, setCurrentAsset] = useState<FormAssetProperty>()

  const handleCheckedChange = (checked: boolean, asset: FormAssetProperty) => {
    const quality = checkedList.length ? checkedList[0].properties.quality : asset.properties.quality
    const isLast = !checked && checkedList.length === 1
    const overMax = checked && checkedList.length === 2

    const list = checkboxList.map((o) => {
      if (o.id === asset.id) {
        return {
          ...o,
          checked: checked
        }
      } else {
        return {
          ...o,
          disabled: (!isLast && o.properties.quality !== quality) || (overMax && !o.checked)
        }
      }
    })
    setcheckboxList(list)
  }

  const handleSellClick = (tab: FormAssetProperty) => {
    setCurrentAsset(tab)
    setSellModalVisible(true)
  }

  const handleSyntheClick = () => {
    setSyntheModalVisible(true)
  }

  const checkedList = useMemo(() => {
    return checkboxList.filter(o => o.checked)
  }, [checkboxList])

  useEffect(() => {
    const data: ICheckedItem[] = assets.map(o => ({
      checked: false,
      disabled: o.properties.quality >= 5,
      ...o,
    }))
    setcheckboxList(data)
  }, [assets])


  return (
    <div className={cx('inventory-tab')}>
      <div>
        <Button
          size="large"
          disabled={checkedList.length !== 3}
          type="primary"
          onClick={handleSyntheClick}
        >
          Synthesize
        </Button>
        {/* <Tooltip title="内容待填充">
          <InfoCircleFilled style={{ cursor: 'pointer', color: '#FFBC00', width: '22px', marginLeft: '22px' }} />
        </Tooltip> */}
      </div>
      <div className={cx('panels')}>
        {
          assets.map((tab, index) => {
            return (
              <div className={cx('panel')} key={tab.id}>
                <div className={cx('img')}>
                  <img src={tab.imgSrc} alt="" />
                </div>
                <Checkbox
                  disabled={checkboxList[index]?.disabled}
                  checked={checkboxList[index]?.checked}
                  onChange={(e) => handleCheckedChange(e.target.checked, tab)}
                  className={cx('inventory-checkbox')}
                />
                <div className={cx('name')}>{ }</div>
                <Button
                  style={{ marginTop: '14px', width: '80px' }}
                  type="primary"
                  onClick={() => handleSellClick(tab)}
                >
                  sell
                </Button>
                <div className={cx('attrs')}>
                  {
                    Object.entries(tab.displayProperties).map(([key, value]) => (
                      <div style={{marginTop: '8px'}} key={key}>{key}: {value}</div>
                    ))
                  }
                </div>
              </div>
            )
          })
        }
      </div>
      <SellModal
        visible={sellModalVisible}
        asset={currentAsset}
        onCancel={() => setSellModalVisible(false)}
      />
      <SynthesizeModal
        visible={syntheModalVisible}
        checkedList={checkedList}
        onCancel={() => {
          setSyntheModalVisible(false)
          updateFormAssets()
        }}
      />
    </div>
  )
}

export default InventoryTab