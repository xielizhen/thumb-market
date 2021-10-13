import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Tabs } from 'antd';
import classNames from 'classnames/bind';
import { BitBowTypeEnum, BitBowTypes, QualityTypes } from 'utils/icon';
import { useTotalAmount, useStoreList } from './hooks'
import { debounce } from 'lodash'

import Filter from './components/Filter';
import MarketTable from './components/Table';
import styles from './index.module.scss';
import { useWeb3React } from '@web3-react/core';

const cx = classNames.bind(styles);

const { TabPane } = Tabs;

type SortType = 'DESC' | 'ASC'
interface IFilters {
  type: BitBowTypeEnum
  quality?: number[],
  owner?: boolean,
}
interface ISorts {
  quality?: SortType,
  price?: SortType
}

const Marketplace: React.FC = () => {
  const { account } = useWeb3React();
  const [ activeKey, setActiveKey ] = useState(String(BitBowTypes[0].value))
  const [ filters, setFilters ] = useState<IFilters>({ type: BitBowTypeEnum.BOW })
  const [ sorts, setSorts ] = useState<ISorts>({})
  let { totalAmount, setTotalAmount } = useTotalAmount()
  const { storeList, fetchStoreList, deleteStoreByTokenId } = useStoreList()

  const handleTabChange = useCallback((val: string) => {
    setActiveKey(val)
    setFilters({
      ...filters,
      type: +val
    })
  }, [filters])

  const handleAssets = useCallback((values) => {
    setFilters({
      ...filters,
      ...values
    })
  }, [filters])

  const updateAssets = (id: string) => {
    deleteStoreByTokenId(id)
    setTotalAmount(--totalAmount)
  }

  const displayStoreList = useMemo(() => {
    const qualitys = filters?.quality?.length ? filters.quality : QualityTypes.map(o => o.value)
    const type = filters.type
    const owner = filters.owner

    return storeList.filter(o => {
      const filter = o.type === type && qualitys.includes(o.displayProperties.quality)
      if (owner) return filter && o.owner === account
      return filter
    })
  }, [storeList, filters, sorts, account])

  useEffect(() => {
    if (!totalAmount) return
    fetchStoreList(totalAmount)

  }, [totalAmount])


  return (
    <div className={cx('market-container')}>
      <Tabs centered activeKey={activeKey} onChange={handleTabChange}>
        {
          BitBowTypes.map((tab) => (
            <TabPane tab={`${tab.label}s`} key={tab.value} />
          ))
        }
      </Tabs>
      <div className={cx('content-container')}>
        <Filter filterAssets={handleAssets} />
        <div className={cx('table-container')}>
          <div className={cx('info-container')}>
            <div className={cx('total')}>{totalAmount} Items</div>
            <span>{storeList.length} Current Items</span>
          </div>
          <MarketTable
            assets={displayStoreList}
            updateAssets={(id) => updateAssets(id)}
          />
          <div className={cx('btn-container')}>
            {
              storeList.length === totalAmount ? (
                <div>no more data</div>
              ) : (
                <Button
                  type="primary"
                  ghost
                  onClick={debounce(() => fetchStoreList(totalAmount), 2000)}
                >
                  Show more
                </Button>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Marketplace