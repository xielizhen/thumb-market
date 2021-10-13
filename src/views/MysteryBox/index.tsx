import React, { useEffect, useState } from 'react';
import { Button, Modal, notification } from 'antd';
import classNames from 'classnames/bind';
import { BitBowTypes, BitBowItem } from 'utils/icon';
import moment from 'moment';
import { getBitBowFactoryContract, getBitBowNFTContract } from 'utils/contractHelpers'
import { getBitBowFactoryAddress, getBitBowNFTAddress } from 'utils/addressHelpers'
import { useWeb3React } from '@web3-react/core';
import useWeb3 from 'hooks/useWeb3';
import { fetchPropertiesById } from 'state/account/fetch';
import { FormAssetProperty } from 'state/types';
import { useAddFormAssets } from 'state/account/hooks';
import { useSafeState, useInterval } from 'ahooks'
import ImgContainer from 'components/ImgContainer';

import styles from './index.module.scss';
import giftImg from 'assets/gift.webp'
import useApproveArrow from 'hooks/useApproveArrow';


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
  const { loading, handleApprove, disabled, isApproved, setLoading } = useApproveArrow(getBitBowFactoryAddress())

  const [visible, setVisible] = useState(false)
  const [fee, setFee] = useSafeState(0)
  const [mystery, setMystery] = useState(BitBowTypes[0])
  const [formAsset, setFormAsset] = useState<FormAssetProperty>()
  const [leftTime, setLeftTime] = useState('')

  const nextSunday = moment().day(7).startOf('day')

  // 获取开盲盒所需费用
  const getMintFee = async () => {
    const fee = await getBitBowFactoryContract().methods.mintFee().call();
    setFee(fee)
  }

  // 抽取盲盒
  const handleOpenMystery = async () => {
    try {
      setLoading(true)
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
      setLoading(false)
    }
  }

  // 距离下一次更换盲盒类型时间
  useInterval(() => {
    const duration = moment.duration(nextSunday.diff(moment()))
    setLeftTime(`
      ${duration.days()}d
      ${duration.hours()}h
      ${duration.minutes()}m
      ${duration.seconds()}s
    `)
  }, 1000, { immediate: true })

  useEffect(() => {
    getMintFee()
  }, [account])

  useEffect(() => {
    setMystery(getMysteryItem())
  }, [])

  return (
    <div className={cx('mystery-box')}>
      <img src={giftImg} alt="" />
      <div>
        This blind box contains an {mystery.label} 
        <br /> 
        Cost for each attempt: {fee} Targets
        <br />
        Current round left: {leftTime}
      </div>
      <Button
        disabled={disabled}
        loading={loading}
        size="large"
        type="primary"
        onClick={isApproved ? handleOpenMystery : handleApprove }
      >
        { isApproved ? 'Open it': 'Approve it' }
      </Button>
     
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
            <ImgContainer imgSrc={formAsset?.imgSrc} />
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
