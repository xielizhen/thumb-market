import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Select } from 'antd';
import classNames from 'classnames/bind';
import { BitBowTypeEnum, BitBowTypes, QualityTypes } from 'utils/icon';
import { useTotalAmount, useStoreList } from './hooks'
import { debounce } from 'lodash'
import { useWeb3React } from '@web3-react/core';

import Filter from './components/Filter';
import MarketList from './components/List';
import styles from './index.module.scss';
import { StoreAsset } from 'state/types';
import Loading from 'components/Loading';

const cx = classNames.bind(styles);

const { Option } = Select
const MIN_TAB_NUM = 9

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
  const { isLoading, storeList, fetchStoreList, deleteStoreByTokenId } = useStoreList()

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
    const len = storeList.filter(o => +o.type === +activeKey)?.length
    if (len < MIN_TAB_NUM) fetchStoreList(totalAmount)
  }, [totalAmount, activeKey, storeList, fetchStoreList])


  useEffect(() => {
    const dom = document.getElementById('main')
    const handleScroll = debounce(async () => {
      const scrollTop = dom.scrollTop
      const clientHeight = dom.clientHeight
      const scrollHeight = dom.scrollHeight
      if (scrollTop + clientHeight === scrollHeight) {
        await fetchStoreList(totalAmount)
      }
    }, 500)

    dom.addEventListener('scroll', handleScroll)
    return () => {
      dom.removeEventListener('scroll', handleScroll)
    }
  }, [totalAmount, fetchStoreList])


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
                isLoading && ( <Loading style={{marginTop: '0'}} />)
              )
            }
          </div>
        </div>
      </div> 
    </div>
  )
}

export default Marketplace