import React, { useEffect, useState } from 'react';
import { useAccount } from 'state/account/hooks'
import { BitBowTypes, BitBowTypeEnum } from 'utils/icon'
import { FormAssetProperty } from 'state/types';
import classNames from 'classnames/bind';

import InventoryTab from './components/InverntoryTab';

import styles from './index.module.scss'

const cx = classNames.bind(styles)

const Inventory: React.FC = () => {
  const { formAssets } = useAccount()
  const [ assets, setAssets ] = useState<FormAssetProperty[]>([])
  const [ activeKey, setActiveKey ] = useState(BitBowTypes[0].value)

  const handleTabChange = (val: BitBowTypeEnum) => {
    setActiveKey(val)
    const currentAssets = formAssets.find(o => +o.type === +val)?.assets || []
    setAssets(currentAssets)
  }

  useEffect(() => {
    const initAssets = formAssets.find(o => o.type === BitBowTypes[+activeKey - 1].value)?.assets || []
    setAssets(initAssets)
  }, [formAssets])

  return (

    <div className={cx('container')}>
      <div className={cx('tabs')}>
        {
          BitBowTypes.map((item) => {
            const assets = formAssets.find(o => o.type === item.value)?.assets || []
            const count = assets.length
            const active = activeKey === item.value
            return (
              <div
                className={cx('tab', { active })}
                key={item.value}
                onClick={() => handleTabChange(item.value)}
              >
                { item.label }
                { activeKey === item.value && <span className={cx('num')}>{count}</span> }
              </div>
            )
          })
        }
      </div>
      <div className={cx('content')}>
        <div className={cx('inner')}>
          <InventoryTab assets={assets} />
        </div>
      </div>
    </div>
  )
}

export default Inventory;