import React from 'react';
import { Tabs } from 'antd';
import classNames from 'classnames/bind';
import { BitBowTypes } from 'utils/icon'

import Filter from './components/Filter';
import MarketTable from './components/Table';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

const { TabPane } = Tabs;

const Marketplace: React.FC = () => {
  return (
    <div className={cx('market-container')}>
      <Tabs defaultActiveKey={BitBowTypes[0].label} centered>
        {
          BitBowTypes.map((tab) => (
            <TabPane tab={`${tab.label}s`} key={tab.label} />
          ))
        }
      </Tabs>
      <div className={cx('container')}>
        <Filter />
        <MarketTable />
      </div>
    </div>
  )
}

export default Marketplace