import React from 'react';
import classNames from 'classnames/bind';

import styles from './index.module.scss';
import { Table, Button } from 'antd';

const cx = classNames.bind(styles);

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Name',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Quality',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Weight',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Stability',
  },
  {
    title: 'Draw Speed'
  },
  {
    title: 'Price'
  },
  {
    title: '',
    render: () => {
      return (
        <Button type="primary">Buy</Button>
      )
    }
  }
];

const MarketTable: React.FC = () => {
  return (
    <div className={cx('container')}>
      <div className={cx('info')}>
        <div>65482 Items</div>
        <div>latest</div>
      </div>
      <Table
        className='market-table'
        style={{marginTop: '30px'}}
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  )
}

export default MarketTable;