import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { useAccount } from 'state/account/hooks'
import { BitBowTypes } from 'utils/icon'
import { FormAssetProperty } from 'state/types';

import InventoryTab from './components/InverntoryTab';

const { TabPane } = Tabs;

const Inventory: React.FC = () => {
  const { formAssets } = useAccount()
  const [ assets, setAssets ] = useState<FormAssetProperty[]>([])
  const [ activeKey, setActiveKey ] = useState(String(BitBowTypes[0].value))

  const handleTabChange = (val: string) => {
    setActiveKey(val)
    const currentAssets = formAssets.find(o => +o.type === +val)?.assets || []
    setAssets(currentAssets)
  }

  useEffect(() => {
    const initAssets = formAssets.find(o => o.type === BitBowTypes[+activeKey - 1].value)?.assets || []
    setAssets(initAssets)
  }, [formAssets])

  return (
    <>
      <Tabs activeKey={activeKey} onChange={handleTabChange}>
        {
          BitBowTypes.map((tab) => {
            const assets = formAssets.find(o => o.type === tab.value)?.assets || []
            const count = assets.length
            return (
              <TabPane tab={`${tab.label}s（${count}）`} key={tab.value} />
            )
          })
        }
      </Tabs>
      <InventoryTab assets={assets} />
    </>
  )
}

export default Inventory;