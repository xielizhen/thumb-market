import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Tabs, Select } from 'antd';
import classNames from 'classnames/bind';
import { BitBowTypeEnum, BitBowTypes, QualityTypes } from 'utils/icon';
import { useTotalAmount, useStoreList } from './hooks'
import { debounce } from 'lodash'
import { useWeb3React } from '@web3-react/core';

import Filter from './components/Filter';
import MarketList from './components/List';
import styles from './index.module.scss';
import { StoreAsset } from 'state/types';
import ConfirmBtn, { EnumBtnType } from 'components/ConfirmBtn';

const cx = classNames.bind(styles);

const { TabPane } = Tabs;
const { Option } = Select

interface IFilters {
  type: BitBowTypeEnum
  quality?: number[],
  owner?: boolean,
}

const sortOptions: {
  label: string,
  strategy: (a: StoreAsset, b: StoreAsset) => number
}[] = [
    {
      label: 'Highest Quality',
      strategy: (a: StoreAsset, b: StoreAsset) => {
        return b.displayProperties.quality - a.displayProperties.quality
      }
    },
    {
      label: 'Lowest Qualilty',
      strategy: (a: StoreAsset, b: StoreAsset) => {
        return a.displayProperties.quality - b.displayProperties.quality
      }
    },
    {
      label: 'Highest Price',
      strategy: (a: StoreAsset, b: StoreAsset) => {
        return b.price - a.price
      }
    },
    {
      label: 'Lowest Price',
      strategy: (a: StoreAsset, b: StoreAsset) => {
        return a.price - b.price
      }
    }
  ]

const Marketplace: React.FC = () => {
  const { account } = useWeb3React();
  const [ activeKey, setActiveKey ] = useState(BitBowTypes[0].value)
  const [ filters, setFilters ] = useState<IFilters>({ type: BitBowTypeEnum.BOW })
  const [ sortType, setSortType ] = useState<string>(sortOptions[0].label)
  let { totalAmount, setTotalAmount } = useTotalAmount()
  const { storeList, fetchStoreList, deleteStoreByTokenId } = useStoreList()

  const handleTabChange = useCallback((val: number) => {
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

    const filterList = storeList.filter(o => {
      const filter = o.type === type && qualitys.includes(o.displayProperties.quality)
      if (owner) return filter && o.owner === account
      return filter
    })

    const strategy = sortOptions.find(o => o.label === sortType)?.strategy || sortOptions[0].strategy
    return filterList.sort(strategy)
  }, [storeList, filters, sortType, account])

  useEffect(() => {
    if (!totalAmount) return
    fetchStoreList(totalAmount)

  }, [totalAmount])


  return (
    <div className={cx('market-container')}>

      <div className={cx('tabs')}>
        {
          BitBowTypes.map((tab) => {
            const active = activeKey === tab.value
            return (
              <div
                className={cx('tab', { active })}
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
              >
                {tab.label}s
              </div>
            )
          })
        }
      </div>

      <div className={cx('content-container')}>
        <Filter filterAssets={handleAssets} />
        <div className={cx('table-container')}>
          <div className={cx('info-container')}>
            <div className={cx('total')}>{totalAmount} Items</div>
            <Select
              defaultValue={sortOptions[0].label}
              onChange={(val) => setSortType(val)}>
              {
                sortOptions.map((o) => (
                  <Option value={o.label} key={o.label}>{o.label}</Option>
                ))
              }
            </Select>
          </div>
          <MarketList
            assets={displayStoreList}
            updateAssets={(id) => updateAssets(id)}
          />
          <div className={cx('btn-container')}>
            {
              storeList.length === totalAmount ? (
                <div className={cx('no-data')}>No more data</div>
              ) : (
                <ConfirmBtn
                  title="Show more"
                  onClick={debounce(() => fetchStoreList(totalAmount), 2000)}
                  btnType={EnumBtnType.SMALL}
                />
              )
            }
          </div>
        </div>
      </div> 
    </div>
  )
}

export default Marketplace