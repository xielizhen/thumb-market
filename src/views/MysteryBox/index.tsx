import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import classNames from 'classnames/bind';

import styles from './index.module.scss';
import giftImg from 'assets/gift.webp'
import { BitBowTypeEnum, BitBowTypes, BitBowItem } from 'utils/icon';
import moment from 'moment';
import { getBitBowFactoryContract, getBitBowNFTContract } from 'utils/contractHelpers'
import { useWeb3React } from '@web3-react/core';
import useWeb3 from 'hooks/useWeb3';
import { fetchPropertiesById } from 'state/account/fetch';
import { FormAssetProperty } from 'state/types';
import { useUpdateFormAssets } from 'state/account/hooks';

const cx = classNames.bind(styles);

const getMysteryItem = (): BitBowItem => {
  const currentWeek = moment().week();
  const len = BitBowTypes.length;
  return BitBowTypes[currentWeek % len]
}

const MysteryBox: React.FC = () => {
  const { account } = useWeb3React()
  const web3 = useWeb3();
  const { handleUpdateFormAsset } = useUpdateFormAssets();

  const [visible, setVisible] = useState(false)
  const [openBtnLoading, setOpenBtnLoading] = useState(false)
  const [fee, setFee] = useState(0)
  const [mystery, setMystery] = useState(BitBowTypes[0])
  const [formAsset, setFormAsset] = useState<FormAssetProperty>()

  const getMintFee = useCallback(async () => {
    const fee = await getBitBowFactoryContract().methods.mintFee().call();
    setFee(fee)
  }, [account])

  const handleOpenMystery = async () => {
    try {
      setOpenBtnLoading(true)
      // 判断该地址是否领取过首次盲盒
      const isNft = await getBitBowNFTContract().methods.balanceOf(account).call();
      const isFirst = await getBitBowFactoryContract().methods.firstAddress(account).call()

      // 抽取盲盒
      const id = await getBitBowFactoryContract(web3)
        .methods
        .openMysteryBox(1, false)
        .send({
          from: account
        })

      // 根据id获取properties和img
      const asset = await fetchPropertiesById(id)
      setFormAsset(asset)
      setVisible(true)

      // 更新formAssets
      handleUpdateFormAsset(asset)
    } finally {
      setOpenBtnLoading(false)
    }
  }

  useEffect(() => {
    getMintFee()
  }, [getMintFee])

  useEffect(() => {
    setMystery(getMysteryItem())
  }, [])

  return (
    <div className={cx('mystery-box')}>
      <img src={giftImg} alt="" />
      <div>
        This blind box contains an {mystery.label} <br /> Cost for each attempt: {fee} Targets
      </div>
      <Button loading={openBtnLoading} size="large" type="primary" onClick={handleOpenMystery}>Open it</Button>

      <Modal
        className='mystery-modal'
        title="Congratulations！"
        centered
        width={690}
        footer={null}
        visible={visible}
        // onOk={this.hideModal}
        // onCancel={this.hideModal}
        okText="确认"
        cancelText="取消"
      >
        <div className={cx('modal-content')}>
          <div className={cx('info')}>You got a XXX bow from the blind box</div>
          <div className={cx('detail')}>
            <div className={cx('img')}></div>
            <div className={cx('attrs')}>
              <p>Deadly Bow</p>
              <p>Quality：Normal</p>
              <p>Weight：24</p>
            </div>
          </div>
          <Button type="primary" size="large">Great</Button>
        </div>
      </Modal>
    </div>
  )
}

export default MysteryBox