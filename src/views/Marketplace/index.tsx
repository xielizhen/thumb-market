import React, { useMemo, useState } from 'react';
import { Tabs } from 'antd';
import classNames from 'classnames/bind';
import { BitBowTypes } from 'utils/icon';
import { useMarket, useTotalAmount, useAddStoreList } from 'state/market/hooks';

import Filter from './components/Filter';
import MarketTable from './components/Table';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

const { TabPane } = Tabs;

const Marketplace: React.FC = () => {
  useTotalAmount();
  useAddStoreList();
  const { storeList } = useMarket();

  const [activeKey, setActiveKey] = useState(String(BitBowTypes[0].value))

  const handleTabChange = (val: string) => {
    setActiveKey(val)
  }

  const assets = useMemo(() => {
    return storeList.filter(o => +o.type === +activeKey)
  }, [storeList, activeKey])

  return (
    <div className={cx('market-container')}>
      <Tabs centered activeKey={String(activeKey)} onChange={handleTabChange}>
        {
          BitBowTypes.map((tab) => (
            <TabPane tab={`${tab.label}s`} key={tab.value} />
          ))
        }
      </Tabs>
      <div className={cx('container')}>
        <Filter />
        <MarketTable assets={assets}  />
      </div>
    </div>
  )
}

export default Marketplace