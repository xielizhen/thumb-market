import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Table, Button, notification } from 'antd';
import { FormAssetProperty, StoreAsset } from 'state/types';
import classNames from 'classnames/bind';
import ImgContainer from 'components/ImgContainer';
import { QualityTypes } from 'utils/icon';
import useApproveArrow from 'hooks/useApproveArrow';
import { useWeb3React } from '@web3-react/core';
import { getBitBowStoreAddress } from 'utils/addressHelpers';
import { getStoreContract } from 'utils/contractHelpers';
import useWeb3 from 'hooks/useWeb3';
import { useStoreList } from 'views/Marketplace/hooks';
import { debounce } from 'lodash';

import styles from './index.module.scss';

const cx = classNames.bind(styles);
interface IProps {
  assets: StoreAsset[],
  updateAssets?: (id: string) => void
}

const MarketTable: React.FC<IProps> = ({ assets, updateAssets }) => {
  const { account } = useWeb3React()
  const web3 = useWeb3()
  const { loading, handleApprove, isApproved } = useApproveArrow(getBitBowStoreAddress())

  const handleBuy = async (tokenId: string) => {
    try {
      // const res = await getStoreContract(web3).methods.buy(tokenId).send({
      //   from: account,
      //   gas: 500000
      // })

      notification.success({
        message: 'Buy Success'
      })

       // 从storelist列表删除
       updateAssets(tokenId)
    } catch (e: any) {
      notification.error({
        message: 'Error',
        description: e?.message
      })
    }
  }

  const handleDelist = async (tokenId: string) => {
    try {
      const res = await getStoreContract(web3).methods.unlock(tokenId).send({
        from: account,
        gas: 500000
      })

      notification.success({
        message: 'Delist Success'
      })

       // 从storelist列表删除
       updateAssets(tokenId)
    } catch (e: any) {
      notification.error({
        message: 'Error',
        description: e?.message
      })
    }
  }

  const baseColumns = [
    {
      title: '',
      dataIndex: 'imgSrc',
      key: 'imgSrc',
      render: (imgSrc: string) => {
        return <ImgContainer imgSrc={imgSrc} />
      }
    },
    {
      title: 'Quality',
      dataIndex: 'quality',
      key: 'quality',
      render: (_, source: FormAssetProperty) => {
        return (
          <span>
            {QualityTypes.find(o => o.value === source.displayProperties.quality)?.label}
          </span>
        )
      }
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price: string) => {
        return <span>{price} Arrow</span>
      }
    },
    {
      title: '',
      render: (_, source) => {
        return (
          account ? (
            source.owner === account
              ? <Button
                onClick={() => handleDelist(source.id)}
                type="primary"
                danger
              >
                Delist
              </Button>
              : isApproved
                ? <Button
                  onClick={() => handleBuy(source.id)}
                  type="primary"
                > Buy
                </Button>
                : <Button
                  loading={loading}
                  onClick={handleApprove}
                  type="primary">
                    Approve it
                </Button>
          ) : ''
        )
      }
    }
  ]

  const columns = useMemo(() => {
    let propertyColums = []
    if (assets.length) {
      propertyColums = Object.entries((assets[0]?.displayProperties || []))
        .filter(([key]) => key !== 'quality')
        .map(([key]) => ({
          title: key.substring(0, 1).toUpperCase().concat(key.slice(1)),
          dataIndex: key,
          render: (_, source: StoreAsset) => {
            return <span>{source?.displayProperties[key]}</span>
          }
        }))
    }
    return baseColumns.slice(0, 2).concat(propertyColums, baseColumns.slice(-2))
  }, [assets, loading])


  return (
    <Table
      className='market-table'
      style={{ marginTop: '30px' }}
      dataSource={assets}
      columns={columns}
      pagination={false}
      rowKey='id'
    />
  )
}

export default MarketTable;