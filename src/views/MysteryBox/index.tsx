import React, { useEffect, useState } from 'react';
import { Button, Modal, notification } from 'antd';
import classNames from 'classnames/bind';
import { BitBowTypes, BitBowItem } from 'utils/icon';
import moment from 'moment';
import { getBitBowFactoryContract, getBitBowNFTContract, getArrowContract } from 'utils/contractHelpers'
import { getBitBowFactoryAddress, getBitBowNFTAddress } from 'utils/addressHelpers'
import { useWeb3React } from '@web3-react/core';
import useWeb3 from 'hooks/useWeb3';
import { fetchPropertiesById } from 'state/account/fetch';
import { FormAssetProperty } from 'state/types';
import { useAddFormAssets } from 'state/account/hooks';
import { MAX_UNIT_256 } from 'config'
import { useSafeState } from 'ahooks'

import styles from './index.module.scss';
import giftImg from 'assets/gift.webp'


const cx = classNames.bind(styles);

const getMysteryItem = (): BitBowItem => {
  const currentWeek = moment().week();
  const len = BitBowTypes.length;
  return BitBowTypes[currentWeek % len]
}

const MysteryBox: React.FC = () => {
  const { account } = useWeb3React()
  const web3 = useWeb3();
  const { updateFormAssets } = useAddFormAssets();

  const [visible, setVisible] = useState(false)
  const [openBtnLoading, setOpenBtnLoading] = useState(false)
  const [fee, setFee] = useSafeState(0)
  const [mystery, setMystery] = useState(BitBowTypes[0])
  const [formAsset, setFormAsset] = useState<FormAssetProperty>()
  const [isApproved, setIsApproved] = useSafeState(false)
  const [disabled, setDisabled] = useState(true)

  // 获取开盲盒所需费用
  const getMintFee = async () => {
    const fee = await getBitBowFactoryContract().methods.mintFee().call();
    setFee(fee)
  }

  // 获取授权金额
  const getIsApproved = async () => {
    if (!account) return
    try {
      setDisabled(true)
      const allownance = await getArrowContract()
        .methods
        .allowance(account, getBitBowFactoryAddress())
        .call()
      setIsApproved(+allownance > 1000)
    } finally {
      setDisabled(false)
    }
  }

  // 抽取盲盒
  const handleOpenMystery = async () => {
    try {
      setOpenBtnLoading(true)
      // 判断该地址是否领取过首次盲盒
      const isNft = await getBitBowNFTContract().methods.balanceOf(account).call();

      // 抽取盲盒
      const receipt = await getBitBowFactoryContract(web3)
        .methods
        .openMysteryBox(mystery.value, !isNft)
        .send({
          gas: 500000,
          from: account
        })
      let id = 0
      const events = receipt.events
      for (let key in events) {
        const event = events[key]
        if (event.address === getBitBowNFTAddress()) {
          const topics = event.raw.topics
          id = web3.utils.hexToNumber(topics[topics.length - 1])
        }
      }

      // 根据id获取properties和img
      const asset = await fetchPropertiesById(String(id))
      setFormAsset(asset)
      setVisible(true)

      // 更新formAssets
      updateFormAssets()
    } catch (e: any) {
      notification.error({
        message: 'Error',
        description: e?.message
      })
    } finally {
      setOpenBtnLoading(false)
    }
  }

  // 授权
  const handleApprove = async () => {
    const amount = web3.utils.toHex(MAX_UNIT_256.toString())
    try {
      setOpenBtnLoading(true)
      await getArrowContract(web3)
        .methods
        .approve(getBitBowFactoryAddress(), amount)
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
      setOpenBtnLoading(false)
    }
  }

  useEffect(() => {
    getMintFee()
    getIsApproved()
  }, [account])

  useEffect(() => {
    setMystery(getMysteryItem())
  }, [])

  return (
    <div className={cx('mystery-box')}>
      <img src={giftImg} alt="" />
      <div>
        This blind box contains an {mystery.label} <br /> Cost for each attempt: {fee} Targets
      </div>
      {
        isApproved
          ? <Button disabled={disabled} loading={openBtnLoading} size="large" type="primary" onClick={handleOpenMystery}>Open it</Button>
          : <Button disabled={disabled} loading={openBtnLoading} size="large" type="primary" onClick={handleApprove}>Approve it</Button>
      }

      <Modal
        className='mystery-modal'
        title="Congratulations！"
        centered
        width={690}
        footer={null}
        visible={visible}
        okText="确认"
        cancelText="取消"
      >
        <div className={cx('modal-content')}>
          <div className={cx('info')}>You got a {BitBowTypes.find(o => o.value === formAsset?.type)?.label} from the blind box</div>
          <div className={cx('detail')}>
            <div className={cx('img')}>
              <img src={formAsset?.imgSrc} alt="" />
            </div>
            <div className={cx('attrs')}>
              {
                Object.entries(formAsset?.displayProperties || []).map(([key, value]) => (
                  <p key={key}>{key}: {value}</p>
                ))
              }
            </div>
          </div>
          <Button type="primary" size="large" onClick={() => setVisible(false)}>Great</Button>
        </div>
      </Modal>
    </div>
  )
}

export default MysteryBox
