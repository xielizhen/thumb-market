import React, { useEffect, useState } from 'react';
import { notification } from 'antd';
import classNames from 'classnames/bind';
import { BitBowTypes, BitBowItem } from 'utils/icon';
import moment from 'moment';
import { getBitBowFactoryContract, getBitBowNFTContract } from 'utils/contractHelpers'
import { getBitBowFactoryAddress, getBitBowNFTAddress } from 'utils/addressHelpers'
import { useWeb3React } from '@web3-react/core';
import useWeb3 from 'hooks/useWeb3';
import { fetchPropertiesById } from 'state/account/fetch';
import { FormAssetProperty } from 'state/types';
import { useAccount, useAddFormAssets } from 'state/account/hooks';
import { useSafeState, useInterval } from 'ahooks';
import useApproveArrow from 'hooks/useApproveArrow';

import Loading from 'components/Loading';
import ConfirmBtn from 'components/ConfirmBtn';
import EquimentItem from 'components/EquimentItem';

import styles from './index.module.scss';
import giftImg from 'assets/gift.webp';


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
  const { assets } = useAccount()
  const { loading, handleApprove, disabled, isApproved, setLoading } = useApproveArrow(getBitBowFactoryAddress())

  const [visible, setVisible] = useState(false)
  const [fee, setFee] = useSafeState(0)
  const [mystery, setMystery] = useState(BitBowTypes[0])
  const [formAsset, setFormAsset] = useState<FormAssetProperty>()
  const [leftTime, setLeftTime] = useState('')
  const [isFirst, setIsFirst] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  const nextSunday = moment().day(7).startOf('day')

  // 获取开盲盒所需费用
  const getMintFee = async () => {
    const fee = await getBitBowFactoryContract().methods.mintFee().call();
    setFee(fee)
  }

  // 获取是否第一次抽盲盒
  const getIsFirst = async () => {
    try {
      const isNft = await getBitBowNFTContract().methods.balanceOf(account).call();
      setIsFirst(!Number(isNft))
      setPageLoading(true)
    } finally {
      setPageLoading(false)
    }
  }

  // 抽取盲盒
  const handleOpenMystery = async () => {
    try {
      setLoading(true)
      await getMintFee();
      // 判断是否
      if (assets.arrowNum < fee) {
        return notification.info({
          message: `Open blind box need ${fee} Arrows`,
          className: 'notification-info'
        })
      }
      // 抽取盲盒
      const receipt = await getBitBowFactoryContract(web3)
        .methods
        .openMysteryBox(mystery.value, isFirst)
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
        description: e?.message,
        className: 'notification-error'
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
    getIsFirst()
  }, [account])

  useEffect(() => {
    setMystery(getMysteryItem())
  }, [])

  if (pageLoading) return <Loading />

  return (
    <div className={cx('mystery-box')}>
      {
        visible ? (
          <>
            <div className={cx('cong')}>Congratualations！</div>
            <EquimentItem
              style={{ marginTop: '63px' }}
              type={formAsset?.type}
              quality={formAsset?.displayProperties.quality}
              imgUrl={formAsset?.imgSrc}
              properties={formAsset?.displayProperties}
            />
            <div className={cx('txt')}>You received a {formAsset?.label}</div>
            <ConfirmBtn
              style={{ marginTop: '60px' }}
              title="Great"
              onClick={() => setVisible(false)}
            />
          </>
        ) : (
          <>
            <img src={giftImg} alt="" />
            <div className={cx('info')}>
              This blind box contains an {mystery.label}. Cost for each attempt: {fee} Targets
              {
                !isFirst && (
                  <div className={cx('left-time')}>
                    Current round left: {leftTime}
                  </div>
                )
              }
            </div>
            <ConfirmBtn
              style={{ marginTop: '16px' }}
              title={isApproved ? 'Open it' : 'Approve it'}
              disabled={disabled}
              loading={loading}
              onClick={isApproved ? handleOpenMystery : handleApprove}
            />
          </>
        )
      }
    </div>
  )
}

export default MysteryBox
