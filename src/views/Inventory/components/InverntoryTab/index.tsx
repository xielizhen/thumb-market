import React, { useState } from 'react';
import { Select, Button, Checkbox } from 'antd';
import classNames from 'classnames/bind';

import SellModal from '../SellModal';
import SynthesizeModal from '../SynthesizeModal';
import styles from './index.module.scss'

const cx = classNames.bind(styles)
const { Option } = Select

const tabs = [
  {
    label: 'Death Bow',
    id: 1
  },
  {
    label: 'Blood Bow',
    id: 2
  },
  {
    label: 'Blood Bow 2',
    id: 3
  }
]
const InventoryTab: React.FC = () => {
  const [checkedList, setCheckedList] = useState<string[]>()

  const handleCheckedChange = (checked: boolean, id: number) => {
    console.log(checked)
    console.log(id)
  }

  return (
    <div className={cx('inventory-tab')}>
      <div>
        <Select defaultValue="lucy" style={{ width: 168 }}>
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
        <Button disabled type="primary" style={{ marginLeft: '34px' }}>Synthesize</Button>
      </div>
      <div className={cx('panels')}>
        {
          tabs.map((tab) => (
            <div className={cx('panel')} key={tab.id}>
              <div className={cx('img')}></div>
              <Checkbox onChange={(e) => handleCheckedChange(e.target.checked, tab.id)} className={cx('inventory-checkbox')} />
              <div className={cx('name')}>Death Bow</div>
              <Button style={{ marginTop: '14px', width: '80px' }} type="primary">sell</Button>
              <div className={cx('attrs')}>
                <p>Quality：Normal</p>
                <p>Weight：24</p>
              </div>
            </div>
          ))
        }
      </div>
      <SellModal visible={false} />
      <SynthesizeModal visible={true} />
    </div>
  )
}

export default InventoryTab