import React, { useEffect, useState } from 'react';
import { Modal, Button, notification } from 'antd';
import classNames from 'classnames/bind';
import { getBitBowFactoryContract, getBitBowNFTContract, getTargetContract } from 'utils/contractHelpers'
import { getBitBowFactoryAddress, getBitBowNFTAddress } from 'utils/addressHelpers';
import useWeb3 from 'hooks/useWeb3';
import { useWeb3React } from '@web3-react/core';
import { fetchPropertiesById } from 'state/account/fetch';
import { FormAssetProperty } from 'state/types';
import { MAX_UNIT_256 } from 'config';
import { useSafeState } from 'ahooks'

import TargetIcon from 'assets/target.webp';
import UnkownIcon from 'assets/unkown.webp';
import SynthesizeIcon from 'assets/synthesize.webp';
import CloseIcon from 'assets/close.webp';
import FailIcon from 'assets/fail.webp';
import styles from './index.module.scss'
import ConfirmBtn, { EnumBtnType } from 'components/ConfirmBtn';

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

  const [targetAmount, setTargetAmount] = useSafeState(0)
  const [loading, setLoading] = useState(false)
  const [syntheStatus, setSyntheStatus] = useState(Synthe.UNKOWN)
  const [currentAsset, setCurrentAsset] = useState<FormAssetProperty>()
  const [isApproved, setIsApproved] = useSafeState(false)
  const [disabled, setDisabled] = useSafeState(true)

  const getTargetAmount = async () => {
    if (!checkedList.length) return
    const amount = await getBitBowFactoryContract().methods.synFee(checkedList[0].properties.quality).call()
    setTargetAmount(amount)
  }

  const getIdByLogs = (events: ILogEvent): undefined | number => {
    const nftList = Object.entries(events).filter(([_, item]) => item.address === getBitBowNFTAddress())
    if (!nftList.length) return undefined
    const topics = nftList[nftList.length - 1][1].raw.topics
    return web3.utils.hexToNumber(topics[topics.length - 1])
  }

  const handleConfirm = async () => {
    try {
      setLoading(true)
      const ids = checkedList.map(o => +o.id)
      const type = checkedList[0].type
      const quality = checkedList[0].properties.quality

      const receipt = await getBitBowFactoryContract(web3)
        .methods
        .synthesize(ids, type, quality)
        .send({
          from: account,
          gas: 900000
        })

      const id = getIdByLogs(receipt.events)

      if (id !== undefined) {
        // 合成成功
        setSyntheStatus(Synthe.SUCCESS)
        const asset = await fetchPropertiesById(String(id))
        setCurrentAsset(asset)
      } else {
        // 合成失败
        setSyntheStatus(Synthe.FAIL)
      }
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

  // 查看是否已授权
  const getIsApproved = async () => {
    if (!account) return
    try {
      setDisabled(true)
      // target是否已授权
      const allownance = await getTargetContract()
        .methods
        .allowance(account, getBitBowFactoryAddress())
        .call()
      // nft是否已授权
      const isApproved = await getBitBowNFTContract()
        .methods
        .isApprovedForAll(account, getBitBowFactoryAddress())
        .call()

      setIsApproved(+allownance > 1000 && isApproved)
    } finally {
      setDisabled(false)
    }
  }

  // 授权
  const handleApprove = async () => {
    const amount = web3.utils.toHex(MAX_UNIT_256.toString())
    try {
      setLoading(true)
      // target授权factory
      await getTargetContract(web3)
        .methods
        .approve(getBitBowFactoryAddress(), amount)
        .send({
          from: account
        })
        .on('transactionHash', (tx) => {
          return tx.transactionHash
        })

      // nft授权factory
      await getBitBowNFTContract(web3)
        .methods
        .setApprovalForAll(getBitBowFactoryAddress(), true)
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

  useEffect(() => {
    getTargetAmount()
    setSyntheStatus(Synthe.UNKOWN)
  }, [checkedList])

  return (
    // <Modal
    //   className='synthesize-modal'
    //   title="Synthesize the following items?"
    //   centered
    //   width={690}
    //   footer={null}
    //   visible={visible}
    //   onCancel={onCancel}
    //   okText="确认"
    //   cancelText="取消"
    // >
    //   <div className={cx('content')}>
    //     <div className={cx('synthesize')}>
    //       {
    //         checkedList.map((item) => (
    //           <div className={cx('panel')} key={item.id}>
    //             <ImgContainer
    //               imgSrc={item.imgSrc}
    //             />
    //           </div>
    //         ))
    //       }
    //       <div className={cx('panel')}>
    //         <ImgContainer
    //           imgSrc={TargetIcon}
    //           imgStyle={{width: '40px'}}
    //         />
    //         <div className={cx('text')}>{targetAmount} Targets</div>
    //       </div>
    //     </div>
    //     <div className={cx('dividers')}>
    //       <div className={cx('inner')}>
    //         {
    //           checkedList.map((item) => (
    //             <div className={cx('rect')} key={item.id}></div>
    //           ))
    //         }
    //       </div>
    //     </div>
    //     <div className={cx('divider')}></div>
    //     <ImgContainer
    //       imgSrc={syntheStatus === Synthe.SUCCESS 
    //         ? currentAsset?.imgSrc
    //         : SyntheOptions[syntheStatus]
    //       }
    //     />
    //     {
    //       syntheStatus === Synthe.SUCCESS && (
    //         <div className={cx('attrs')}>
    //           {
    //             Object.entries(currentAsset?.displayProperties || [])?.map(([key, value]) => (
    //               <p key={key}>{key}: {value}</p>
    //             ))
    //           }
    //         </div>
    //       )
    //     }
    //     {syntheStatus === Synthe.SUCCESS ?
    //       <Button 
    //         style={{ marginTop: '48px' }}
    //         type="primary"
    //         onClick={onCancel}
    //       >
    //         Great
    //       </Button>
    //       :
    //       <Button
    //         style={{ marginTop: '48px' }}
    //         loading={loading}
    //         type="primary"
    //         disabled={disabled}
    //         onClick={isApproved ? handleConfirm : handleApprove}
    //       >
    //         {isApproved ? ' Do it now' : 'Approve it'}
    //       </Button>}
    //   </div>
    // </Modal>
    <Modal
      wrapClassName="synthesize-modal"
      width={1009}
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
        <div className={cx('title')}>Synthesize the following items?</div>
        <div className={cx('body')}>
          <div className={cx('pos-first')}></div>
          <div className={cx('pos-second')}></div>
          <div className={cx('pos-third')}></div>
          <div className={cx('target')}>
            <img src={TargetIcon} alt="target icon" />
            <span>{targetAmount} Targets</span>
          </div>
          <div className={cx('succ')}></div>
          <div className={cx('succ-property')}></div>
          <div className={cx('fail')}></div>
        </div>
        <ConfirmBtn
          style={{marginTop: '24px'}}
          btnType={EnumBtnType.SMALL}
          title={isApproved ? ' Do it now' : 'Approve it'}
          onClick={isApproved ? handleConfirm : handleApprove}
          disabled={disabled}
          loading={loading}
        />
      </div>
    </Modal>
  )
}

export default SynthesizeModal