import React from 'react';
import { Tabs } from 'antd';
import classNames from 'classnames/bind';

import Filter from './components/Filter';
import MarketTable from './components/Table';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

const { TabPane } = Tabs;

const tabList = [
  {
    label: 'Bows',
  },
  {
    label: 'Peep Sights'
  },
  {
    label: 'Arrows'
  },
  {
    label: 'Armguards'
  }
]

const Marketplace: React.FC = () => {
  return (
    <Tabs defaultActiveKey={tabList[0].label} centered>
      {
        tabList.map((tab) => (
          <TabPane tab={tab.label} key={tab.label}>
            <div className={cx('container')}>
              <Filter />
              <MarketTable />
            </div>
          </TabPane>
        ))
      }
    </Tabs>
  )
}

export default Marketplace