import React, { useEffect, useState } from 'react';
import { Modal, Button, notification } from 'antd';
import classNames from 'classnames/bind';
import { getBitBowFactoryContract } from 'utils/contractHelpers'
import useWeb3 from 'hooks/useWeb3';
import { useWeb3React } from '@web3-react/core';
import { fetchPropertiesById } from 'state/account/fetch';
import { useAddFormAssets } from 'state/account/hooks';
import { FormAssetProperty } from 'state/types';

import TargetIcon from 'assets/target.webp';
import UnkownIcon from 'assets/unkown.webp';
import FailIcon from 'assets/fail.webp';
import styles from './index.module.scss'

const cx = classNames.bind(styles)

enum Synthe {
  UNKOWN = 'UNKOWN',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL'
}

const SyntheOptions = {
  [Synthe.UNKOWN]: UnkownIcon,
  [Synthe.FAIL]: FailIcon
}
interface IProps {
  visible: boolean,
  checkedList: FormAssetProperty[],
  onCancel: () => void
}
const SynthesizeModal: React.FC<IProps> = ({ visible, onCancel, checkedList }) => {
  const web3 = useWeb3()
  const { account } = useWeb3React()
  const { updateFormAssets } = useAddFormAssets();

  const [targetAmount, setTargetAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [syntheStatus, setSyntheStatus] = useState(Synthe.UNKOWN)
  const [currentAsset, setCurrentAsset] = useState<FormAssetProperty>()

  const getTargetAmount = async () => {
    if (!checkedList.length) return
    const amount = await getBitBowFactoryContract().methods.synFee(checkedList[0].properties.quality).call()
    setTargetAmount(amount)
  }

  const handleConfirm = async () => {
    try {
      setLoading(true)
      const ids = checkedList.map(o => o.id)
      const type = checkedList[0].type
      const quality = checkedList[0].properties.quality

      const data = await getBitBowFactoryContract(web3)
        .methods
        .synthesize(ids, type, quality)
        .send({
          from: account
        })
      console.log(data)

      // 合成成功
      setSyntheStatus(Synthe.SUCCESS)
      const id = '0'
      const asset = await fetchPropertiesById(id)
      setCurrentAsset(asset)
      updateFormAssets()

      // 合成失败
      setSyntheStatus(Synthe.FAIL)
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
    getTargetAmount()
  }, [checkedList])

  return (
    <Modal
      className='synthesize-modal'
      title="Synthesize the following items?"
      centered
      width={690}
      footer={null}
      visible={visible}
      onCancel={onCancel}
      okText="确认"
      cancelText="取消"
    >
      <div className={cx('content')}>
        <div className={cx('synthesize')}>
          {
            checkedList.map((item) => (
              <div className={cx('panel')} key={item.id}>
                <div className={cx('img')}>
                  <img src={item.imgSrc} alt="" />
                </div>
              </div>
            ))
          }
          <div className={cx('panel')}>
            <div className={cx('img')}>
              <img className={cx('target-img')} src={TargetIcon} alt="" />
            </div>
            <div className={cx('text')}>{targetAmount} Targets</div>
          </div>
        </div>
        <div className={cx('dividers')}>
          <div className={cx('inner')}>
            {
              checkedList.map((item) => (
                <div className={cx('rect')} key={item.id}></div>
              ))
            }
          </div>
        </div>
        <div className={cx('divider')}></div>
        <div className={cx('img')}>
          <img src={SyntheOptions[syntheStatus]} alt="" />
          {
            syntheStatus === Synthe.SUCCESS && (
              <div className={cx('attrs')}>
                {
                  Object.entries(currentAsset?.displayProperties || [])?.map(([key, value]) => (
                    <p key={key}>{key}: {value}</p>
                  ))
                }
              </div>
            )
          }
        </div>
        <Button
          style={{ marginTop: '48px' }}
          type="primary"
          loading={loading}
          onClick={handleConfirm}
        >
          Do it now
        </Button>
      </div>
    </Modal>
  )
}

export default SynthesizeModal