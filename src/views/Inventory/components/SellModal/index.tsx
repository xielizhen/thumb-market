import React, { useState } from 'react';
import { Modal, Input, Button, notification } from 'antd';
import classNames from 'classnames/bind';
import { FormAssetProperty } from 'state/types';
import { getStoreContract } from 'utils/contractHelpers';
import useWeb3 from 'hooks/useWeb3';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js'

import styles from './index.module.scss'

const cx = classNames.bind(styles)

interface IProps {
  visible: boolean,
  asset: FormAssetProperty,
  onCancel: () => void
}
const SellModal: React.FC<IProps> = ({ visible, asset, onCancel}) => {
  const web3 = useWeb3()
  const { account } = useWeb3React()

  const [ loading, setLoading ] = useState(false)
  const [ amount, setAmount ] = useState<string | number>('')

  const handleConfirm = async () => {
    try {
      setLoading(true)
      const num = new BigNumber(amount)
      const data = await getStoreContract(web3).methods.sell(Number(asset.id), num).send({
        from: account
      })
      // 更新store中的数据列表
    } catch (e: any) {
      notification.error({
        message: 'Error',
        description: e?.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      className='sell-modal'
      title="Sell Death Bow"
      centered
      footer={null}
      visible={visible}
      onCancel={onCancel}
      okText="确认"
      cancelText="取消"
    >
      <div className={cx('content')}>
        <div className={cx('img')}>
          <img src={asset?.imgSrc} alt="" />
        </div>
        <label className={cx('input')}>
          price
          <Input
            className={cx('sell-input')}
            style={{margin: '0 16px'}}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          arrows
        </label>
        <Button
          style={{marginTop: '48px'}}
          loading={loading}
          type="primary"
          onClick={handleConfirm}
        >
          List it on market
        </Button>
      </div>
    </Modal>
  )
}

export default SellModal