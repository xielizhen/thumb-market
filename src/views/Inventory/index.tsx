import React from 'react';
import { Tabs } from 'antd';
import classNames from 'classnames/bind';

import InventoryTab from './components/InverntoryTab';
import styles from './index.module.scss';

const cx = classNames.bind(styles);
const { TabPane } = Tabs;

const tabs = [
  {
    label: 'Bows（3)'
  },
  {
    label: 'Peep Sights（13）'
  },
  {
    label: 'Arrows（3）'
  },
  {
    label: 'Armguards（3）'
  }
]

const Inventory: React.FC = () => {
  return (
    <Tabs defaultActiveKey="1">
      {
        tabs.map((tab, idx) => (
          <TabPane tab={tab.label} key={idx}>
            <InventoryTab />
          </TabPane>
        ))
      }
    </Tabs>
  )
}

export default Inventory;