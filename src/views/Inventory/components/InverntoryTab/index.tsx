import React, { useState } from 'react';
import { Select, Button, Checkbox } from 'antd';
import classNames from 'classnames/bind';

import SellModal from '../SellModal';
import SynthesizeModal from '../SynthesizeModal';
import styles from './index.module.scss'
import { IPropertiesRule } from 'utils/icon';

const cx = classNames.bind(styles)
const { Option } = Select

interface IProps {
  assets: IPropertiesRule[]
}
const InventoryTab: React.FC<IProps> = ({ assets }) => {
  const [checkedList, setCheckedList] = useState<string[]>()

  const handleCheckedChange = (checked: boolean, id: string) => {
    console.log(checked)
    console.log(id)
  }

  return (
    <div className={cx('inventory-tab')}>
      <div>
        {/* <Select defaultValue="lucy" style={{ width: 168 }}>
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select> */}
        <Button size="large" disabled type="primary">Synthesize</Button>
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
                <div className={cx('img')}></div>
                <Checkbox onChange={(e) => handleCheckedChange(e.target.checked, tab.id)} className={cx('inventory-checkbox')} />
                <div className={cx('name')}>{ }</div>
                <Button style={{ marginTop: '14px', width: '80px' }} type="primary">sell</Button>
                <div className={cx('attrs')}>
                  {
                     Object.entries(attrs).map(([key, value]) => (
                      <p>{key}: {value}</p>
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