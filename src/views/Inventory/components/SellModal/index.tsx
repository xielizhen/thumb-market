import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, notification } from 'antd';
import classNames from 'classnames/bind';
import { FormAssetProperty } from 'state/types';
import { getBitBowNFTContract, getStoreContract } from 'utils/contractHelpers';
import useWeb3 from 'hooks/useWeb3';
import { useWeb3React } from '@web3-react/core';
import { useAddFormAssets } from 'state/account/hooks'
import { useSafeState } from 'ahooks'
import ImgContainer from 'components/ImgContainer';

import styles from './index.module.scss'
import { getBitBowStoreAddress } from 'utils/addressHelpers';

const cx = classNames.bind(styles)

interface IProps {
  visible: boolean,
  asset: FormAssetProperty,
  onCancel: () => void
}
const SellModal: React.FC<IProps> = ({ visible, asset, onCancel }) => {
  const web3 = useWeb3()
  const { account } = useWeb3React()
  const { updateFormAssets } = useAddFormAssets()

  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState<string | number>('')
  const [isApproved, setIsApproved] = useSafeState(false)
  const [disabled, setDisabled] = useSafeState(true)

  const handleConfirm = async () => {
    try {
      setLoading(true)

      await getStoreContract(web3).methods.sell(Number(asset.id), web3.utils.toHex(amount)).send({
        from: account,
        gas: 500000
      })

      // 更新用户装备清单列表
      updateFormAssets()

      // 关闭modal
      onCancel()
    } catch (e: any) {
      notification.error({
        message: 'Error',
        description: e?.message
      })
    } finally {
      setLoading(false)
    }
  }

  // 获取授权金额
  const getIsApproved = async () => {
    if (!account) return
    try {
      setDisabled(true)
      const isApproved = await getBitBowNFTContract()
        .methods
        .isApprovedForAll(account, getBitBowStoreAddress())
        .call()
      setIsApproved(isApproved)
    } finally {
      setDisabled(false)
    }
  }

  // 授权
  const handleApprove = async () => {
    try {
      setLoading(true)
      await getBitBowNFTContract(web3)
        .methods
        .setApprovalForAll(getBitBowStoreAddress(), true)
        .send({
          from: account
        })
        .on('transactionHash', (tx) => {
          return tx.transactionHash
        })

      await getIsApproved()
    } catch (e: any) {
      notification.error({
        message: 'Error',
        description: e?.message
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getIsApproved()
  }, [account])


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
        <ImgContainer imgSrc={asset?.imgSrc} />
        <label className={cx('input')}>
          price
          <Input
            className={cx('sell-input')}
            style={{ margin: '0 16px' }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          arrows
        </label>
        <Button
          style={{marginTop: '48px'}}
          loading={loading}
          type="primary"
          disabled={disabled}
          onClick={ isApproved ? handleConfirm : handleApprove}
        >
          { isApproved ? 'List it on market': 'Approve it' }
        </Button>
      </div>
    </Modal>
  )
}

export default SellModal