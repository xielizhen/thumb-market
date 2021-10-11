import React, { useMemo } from 'react';
import { Table, Button } from 'antd';
import { StoreAsset } from 'state/types';
import { useMarket, useAddStoreListCb } from 'state/market/hooks';
import classNames from 'classnames/bind';
import { debounce } from 'lodash'

import ImgContainer from 'components/ImgContainer';

import styles from './index.module.scss';

const cx = classNames.bind(styles);

const beforeColumns = [
  {
    title: '',
    dataIndex: 'imgSrc',
    key: 'imgSrc',
    render: (imgSrc: string) => {
      return <ImgContainer imgSrc={imgSrc} />
    }
  }
]

const afterColumns = [
  {
    title: 'Price',
    dataIndex: 'price',
    render: (price: string) => {
      return <span>{price} BNB</span>
    }
  },
  {
    title: '',
    render: () => {
      return (
        <Button type="primary">Buy</Button>
      )
    }
  }
]

interface IProps {
  assets: StoreAsset[]
}

const MarketTable: React.FC<IProps> = ({ assets }) => {
  const { totalAmount, storeList } = useMarket();
  const { getStoreList } = useAddStoreListCb();

  const selfColumns = Object.entries((assets[0]?.displayProperties || [])).map(([key, value]) => ({
    title: key.substring(0, 1).toUpperCase().concat(key.slice(1)),
    dataIndex: key,
    render: (_, source: StoreAsset) => {
      return source?.displayProperties[key]
    }
  }))

  const columns = useMemo(() => {
    return assets.length ? [...beforeColumns, ...selfColumns, ...afterColumns]: []
  }, [assets])

  return (
    <div className={cx('container')}>
      <div className={cx('info')}>
        <div>{totalAmount} Items</div>
      </div>
      <Table
        className='market-table'
        style={{marginTop: '30px'}}
        dataSource={assets}
        columns={columns}
        pagination={false}
        rowKey='id'
      />
      <div className={cx('btn-container')}>
        {
          storeList.length === totalAmount ? (
            <div>no more data</div>
          ): (
            <Button
              type="primary"
              ghost
              onClick={debounce(getStoreList, 1000)}
            >
              Show more
            </Button>
          )
        }
      </div>
    </div>
  )
}

export default MarketTable;