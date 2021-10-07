import React, { useState } from 'react';
import { Button, Checkbox, Tooltip } from 'antd';
import classNames from 'classnames/bind';
import { FormAssetProperty } from 'state/types';
import { InfoCircleFilled } from '@ant-design/icons';

import SellModal from '../SellModal';
import SynthesizeModal from '../SynthesizeModal';
import styles from './index.module.scss';
import { url } from 'inspector';

const cx = classNames.bind(styles)

interface IProps {
  assets: FormAssetProperty[]
}
const InventoryTab: React.FC<IProps> = ({ assets }) => {
  const [checkedList, setCheckedList] = useState<FormAssetProperty[]>([])

  const handleCheckedChange = (checked: boolean, asset: FormAssetProperty) => {
    const idx = checkedList.findIndex(o => o.id === asset.id)
    if (idx > -1) {
      setCheckedList(checkedList.slice(0, idx).concat(checkedList.slice(idx + 1)))
    } else {
      setCheckedList(checkedList.concat(asset))
    }
  }

  return (
    <div className={cx('inventory-tab')}>
      {checkedList.map(o => o.id).join(',')}
      <div>
        <Button size="large" disabled type="primary">Synthesize</Button>
        <Tooltip title="test">
          <InfoCircleFilled style={{cursor: 'pointer', color: '#FFBC00', width: '22px', marginLeft: '22px'}} />
        </Tooltip>
      </div>
      <div className={cx('panels')}>
        {
          assets.map((tab) => {
            const unShowAttributes = ['mode', 'color1', 'color2', 'color3']
            const attrs = Object.keys(tab.properties).reduce((acc, curr) => {
              if (!unShowAttributes.includes(curr)) acc[curr] = tab.properties[curr]
              return acc
            }, {})
            return (
              <div className={cx('panel')} key={tab.id}>
                <div className={cx('img')}>
                  <img src={tab.imgSrc} alt="" />
                </div>
                <Checkbox onChange={(e) => handleCheckedChange(e.target.checked, tab)} className={cx('inventory-checkbox')} />
                <div className={cx('name')}>{ }</div>
                <Button style={{ marginTop: '14px', width: '80px' }} type="primary">sell</Button>
                <div className={cx('attrs')}>
                  {
                    Object.entries(attrs).map(([key, value]) => (
                      <p key={key}>{key}: {value}</p>
                    ))
                  }
                </div>
              </div>
            )
          })
        }
      </div>
      <SellModal visible={false} />
      <SynthesizeModal visible={false} />
    </div>
  )
}

export default InventoryTab