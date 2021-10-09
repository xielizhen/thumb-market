import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import classNames from 'classnames/bind';
import { BitBowTypes } from 'utils/icon';
import { getBitBowNFTContract } from 'utils/contractHelpers';
import { getBitBowStoreAddress } from 'utils/addressHelpers';


import Filter from './components/Filter';
import MarketTable from './components/Table';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

const { TabPane } = Tabs;

const Marketplace: React.FC = () => {
  const [totalAmount, setTotalAmount] = useState(0)

  const getTotalItems = async () => {
    const data = await getBitBowNFTContract().methods.balanceOf(getBitBowStoreAddress()).call()
    setTotalAmount(data)
  }

  useEffect(() => {
    getTotalItems()
  }, [])

  return (
    <div className={cx('market-container')}>
      MarketPlace
      {/* <Tabs defaultActiveKey={BitBowTypes[0].label} centered>
        {
          BitBowTypes.map((tab) => (
            <TabPane tab={`${tab.label}s`} key={tab.label} />
          ))
        }
      </Tabs>
      <div className={cx('container')}>
        <Filter />
        <MarketTable totalAmount={totalAmount} />
      </div> */}
    </div>
  )
}

export default Marketplace