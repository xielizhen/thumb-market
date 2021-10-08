import React, { useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, Tooltip } from 'antd';
import classNames from 'classnames/bind';
import { FormAssetProperty } from 'state/types';
import { InfoCircleFilled } from '@ant-design/icons';
import { sortBy } from 'lodash';

import SellModal from '../SellModal';
import SynthesizeModal from '../SynthesizeModal';
import styles from './index.module.scss';

const cx = classNames.bind(styles)

interface IProps {
  assets: FormAssetProperty[]
}
interface ICheckedItem {
  checked: boolean,
  id: string,
  quality: number
}
const InventoryTab: React.FC<IProps> = ({ assets }) => {
  // const [checkboxList, setCheckboxList] = useState<ICheckedItem[]>([])
  const [checkedList, setCheckedList] = useState<ICheckedItem[]>([])
  const [sellModalVisible, setSellModalVisible] = useState(false)
  const [syntheModalVisible, setSyntheModalVisible] = useState(false)
  const [currentAsset, setCurrentAsset] = useState<FormAssetProperty>()

  const handleCheckedChange = (checked: boolean, asset: FormAssetProperty) => {
    // const idx = checkedList.findIndex(o => o.id === asset.id)
    // if (idx > -1) {
    //   setCheckedList(checkedList.slice(0, idx).concat(checkedList.slice(idx + 1)))
    // } else {
    //   setCheckedList(checkedList.concat(asset))
    // }
  }

  const handleSellClick = (tab: FormAssetProperty) => {
    setCurrentAsset(tab)
    setSellModalVisible(true)
  }

  const syntheDisabled = useMemo(() => {
    // const len = checkedList.length;
    // if (len === 3 && checkedList[0].properties.quality !== 5) {
    //   return false
    // }
    return true
  }, [checkedList])

  useEffect(() => {
    const data: ICheckedItem[] = assets.map(o => ({
      checked: false,
      id: o.id,
      quality: o.properties.quality
    }))
    setCheckedList(data)
  }, [assets])


  return (
    <div className={cx('inventory-tab')}>
      <div>
        <Button size="large" disabled={syntheDisabled} type="primary">Synthesize</Button>
        <Tooltip title="test">
          <InfoCircleFilled style={{cursor: 'pointer', color: '#FFBC00', width: '22px', marginLeft: '22px'}} />
        </Tooltip>
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
                  value={checkedList[index]}
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
                      <p key={key}>{key}: {value}</p>
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
      <SynthesizeModal visible={syntheModalVisible} />
    </div>
  )
}

export default InventoryTab