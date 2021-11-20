import React, { useEffect, useMemo, useState } from 'react';
import { notification } from 'antd';
import classNames from 'classnames/bind';
import { BitBowTypes, BitBowItem, BitBowTypeEnum } from 'utils/icon';
import { getBitBowFactoryContract, getBitBowNFTContract } from 'utils/contractHelpers'
import { getBitBowFactoryAddress, getBitBowNFTAddress } from 'utils/addressHelpers'
import { useWeb3React } from '@web3-react/core';
import useWeb3 from 'hooks/useWeb3';
import { fetchPropertiesById } from 'state/account/fetch';
import { FormAssetProperty } from 'state/types';
import { useAccount, useAddFormAssets } from 'state/account/hooks';
import multicall from 'utils/multicall';
import BitBowFactoryAbi from 'config/abi/BitBowFactory.json';
import { useSafeState } from 'ahooks';
import useApproveArrow from 'hooks/useApproveArrow';
import BigNumber from 'bignumber.js'

import Loading from 'components/Loading';
import ConfirmBtn from 'components/ConfirmBtn';
import EquimentItem from 'components/EquimentItem';

import giftBowImg from 'assets/gift-bow.webp';
import giftArrowImg from 'assets/gift-arrow.webp';
import giftPeepSightImg from 'assets/gift-peep-sight.webp';
import giftArmguardImg from 'assets/gift-armguard.webp';
import stepLeftImg from 'assets/step-left.webp';
import stepRightImg from 'assets/step-right.webp';

import styles from './index.module.scss';

const cx = classNames.bind(styles);

interface IMysteryItem {
  iconSrc: string,
  type: BitBowTypeEnum
}
interface IFee {
  type: BitBowTypeEnum,
  value: number
}
const MYSTERY_OPTIONS: IMysteryItem[] = [
  {
    iconSrc: giftBowImg,
    type: BitBowTypeEnum.BOW
  },
  {
    iconSrc: giftArrowImg,
    type: BitBowTypeEnum.ARROW
  },
  {
    iconSrc: giftPeepSightImg,
    type: BitBowTypeEnum.PEEP_SIGHT
  },
  {
    iconSrc: giftArmguardImg,
    type: BitBowTypeEnum.ARMGUARD
  }
]

const MysteryBox: React.FC = () => {
  const { account } = useWeb3React()
  const web3 = useWeb3();
  const { updateFormAssets } = useAddFormAssets();
  const { assets } = useAccount()
  const { loading, handleApprove, disabled, isApproved, setLoading } = useApproveArrow(getBitBowFactoryAddress())

  const [visible, setVisible] = useState(false)
  const [allFees, setAllFees] = useSafeState<IFee[]>([])
  const [formAsset, setFormAsset] = useState<FormAssetProperty>()
  const [isFirst, setIsFirst] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [mysteryOptions, setMysteryOptions] = useSafeState<IMysteryItem[]>([])
  const [activeType, setActiveType] = useSafeState(BitBowTypeEnum.BOW)

  const mystery = useMemo(() => {
    return BitBowTypes.find(o => o.value === activeType)
  }, [activeType])

  const fee = useMemo(() => {
    return allFees.find(o => o.type === activeType)?.value || 0
  }, [activeType, allFees])

  // 获取开盲盒所需费用
  const getAllMintFees = async (): Promise<IFee[]> => {
    const calls = MYSTERY_OPTIONS.map(o => ({
      address: getBitBowFactoryAddress(),
      name: 'mintFee',
      params: [o.type]
    }))
    let results = await multicall(BitBowFactoryAbi, calls)
    const res = MYSTERY_OPTIONS.map((o, idx) => ({
      type: o.type,
      value: new BigNumber(results[idx])?.toNumber()
    }))
    return res
  }

  // 显示哪几个盲盒允许用户选中
  const handleSelectMysteryOptions = async (): Promise<IMysteryItem[]> => {
    const calls = MYSTERY_OPTIONS.map(o => ({
      address: getBitBowFactoryAddress(),
      name: 'formOpen',
      params: [o.type]
    }))

    const results = await multicall(BitBowFactoryAbi, calls)
    return MYSTERY_OPTIONS.filter((o, idx) => {
      if (results[idx]) return o
    })
  }


  // 获取是否第一次抽盲盒
  const getIsFirst = async () => {
    try {
      const allFees = await getAllMintFees()
      setAllFees(allFees)
      const isNft = await getBitBowNFTContract().methods.balanceOf(account).call();
      const isFirst = !Number(isNft)
      setIsFirst(isFirst)
      if (isFirst) {
        setMysteryOptions(MYSTERY_OPTIONS.slice(0, 1))
        setActiveType(BitBowTypeEnum.BOW)
      } else {
        const options = await handleSelectMysteryOptions()
        setMysteryOptions(options)
        setActiveType(options[0]?.type)
      }
      setPageLoading(true)
    } finally {
      setPageLoading(false)
    }
  }

  // 抽取盲盒
  const handleOpenMystery = async () => {
    try {
      setLoading(true)
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

  const handlePrev = async (idx: number) => {
    setActiveType(mysteryOptions[idx - 1].type)
  }
  const handleNext = async (idx: number) => {
    setActiveType(mysteryOptions[idx + 1].type)
  }

  useEffect(() => {
    getIsFirst()
  }, [account])


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
            <div className={cx('mystery-options')}>
              {
                mysteryOptions.map((o, idx) => {
                  const isActive = o.type === activeType
                  return (
                    <div className={cx('img-container', { active: isActive })} key={o.type}>
                      <img className={cx('equiment')} src={o.iconSrc} alt="giftBowImg" />
                      {
                        isActive && (
                          <div className={cx('steps-container')}>
                            {idx !== 0 && (<img
                              className={cx('step-btn')}
                              src={stepRightImg}
                              alt="stepRightImg"
                              onClick={() => handlePrev(idx)}
                            />)}
                            {
                              idx !== mysteryOptions.length - 1 && (
                                <img
                                  className={cx('step-btn')}
                                  src={stepLeftImg}
                                  alt="stepLeftImg"
                                  onClick={() => handleNext(idx)}
                                />
                              )
                            }
                          </div>
                        )
                      }
                    </div>
                  )
                })
              }
            </div>
            <div className={cx('info')}>
              This blind box contains an <strong>{mystery?.label}</strong>. Cost for each attempt: <strong>{fee} Targets</strong>
            </div>
            <ConfirmBtn
              style={{ marginTop: '16px' }}
              title={isApproved ? 'Claim this mystery box' : 'Approve it'}
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
