import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, notification } from 'antd';
import classNames from 'classnames/bind';
import { FormAssetProperty } from 'state/types';
import { getBitBowNFTContract, getStoreContract } from 'utils/contractHelpers';
import useWeb3 from 'hooks/useWeb3';
import { useWeb3React } from '@web3-react/core';
import { useAddFormAssets } from 'state/account/hooks'
import { useSafeState } from 'ahooks'

import ConfirmBtn, { EnumBtnType } from 'components/ConfirmBtn';
import EquimentItem from 'components/EquimentItem';
import CloseIcon from 'assets/close.webp';

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
    if (!amount) return
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
        description: e?.message,
        className: 'notification-error'

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
        description: e?.message,
        className: 'notification-error'
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
      wrapClassName="sell-modal"
      width={668}
      title={null}
      visible={visible}
      footer={null}
      closable
      closeIcon={
        <img src={CloseIcon} alt='' />
      }
      onCancel={onCancel}
    >
      <div className={cx('content')}>
        <div className={cx('title')}>Sell this Bow</div>
        <div className={cx('body')}>
          <div className={cx('desc')}>
            <div className={cx('left')}>
              <EquimentItem
                type={asset?.type}
                quality={asset?.displayProperties.quality}
                imgUrl={asset?.imgSrc}
                properties={asset?.displayProperties}
              />
            </div>
            <div className={cx('right')}>
              <div className={cx('name')}>Price</div>
              <div className={cx('input')}>
                <Input
                  className={cx('sell-input')}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                Arrows
              </div>
            </div>
          </div>
          <ConfirmBtn
            btnType={EnumBtnType.SMALL}
            style={{ width: isApproved ? '220px' : '160px' }}
            title={ isApproved ? 'List it on market': 'Approve it' }
            onClick={ isApproved ? handleConfirm : handleApprove}
            disabled={disabled}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  )
}

export default SellModal