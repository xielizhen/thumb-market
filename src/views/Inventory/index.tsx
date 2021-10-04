import React from 'react';
import { Tabs } from 'antd';
import classNames from 'classnames/bind';
import { useAccount } from 'state/account/hooks'
import { BitBowTypes } from 'utils/icon'

import InventoryTab from './components/InverntoryTab';
import styles from './index.module.scss';

const cx = classNames.bind(styles);
const { TabPane } = Tabs;

const Inventory: React.FC = () => {
  const { formAssets } = useAccount()

  return (
    <Tabs defaultActiveKey="1">
      {
        BitBowTypes.map((tab) => {
          const assets = formAssets.find(o => o.type === tab.value)?.assets || []
          const count = assets.length
          return (
            <TabPane tab={`${tab.label}（${count}）`} key={tab.value}>
              <InventoryTab assets={assets} />
            </TabPane>
          )
        })
      }
    </Tabs>
  )
}

export default Inventory;