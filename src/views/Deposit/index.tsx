import React, { useMemo, useState } from "react";
import { Input, Button, notification } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons'
import classNames from "classnames/bind";
import { useAccount, useUpdateAllAssets, useUpdateUserInfo } from "state/account/hooks";
import { useWeb3React } from "@web3-react/core";
import { getTargetContract } from 'utils/contractHelpers'
import useWeb3 from "hooks/useWeb3";
import { GAME_ADDRESS } from "config";

import TargetIcon from 'assets/target.webp';
import BnbLogoIcon from 'assets/bnbLogo.webp';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

const Deposit: React.FC = () => {
  const { account } = useWeb3React()
  const { assets, userInfo } = useAccount()
  const web3 = useWeb3()
  const [ amount, setAmount ] = useState<string | number>('')
  const [ loading, setLoading ] = useState(false)
  const { updateUserInfo } = useUpdateUserInfo()
  const { updateAllAssets } = useUpdateAllAssets()

  const disabled = useMemo(() => {
    return Number(amount) <= 0
  }, [amount])
  
  const max = useMemo(() => {
    return  assets.targetNum > 1 ? assets.targetNum : 0
  }, [assets.targetNum])
  
  const handleNumChange = (e) => {
    const val = parseFloat(e.target.value)
    if (isNaN(val)) return setAmount('')
    if (val < 0) return setAmount('')
    if (val > max) return setAmount(max)
    return setAmount(val)
  }

  const handleTransfer = async () => {
    const num = web3.utils.toWei(String(amount), 'ether');
    try {
      setLoading(true)
      await getTargetContract(web3).methods.transfer(GAME_ADDRESS, num).send({
        from: account
      })

      // 更新store中的arrow和game中的余额
      updateAllAssets()
      updateUserInfo()
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
    <div className={cx('deposit-container')}>

      <div className={cx('balance')}>
        <div className={cx('wallet-balance')}>
          <div className={cx('title')}>Wallet</div>
          <div className={cx('desc')}>
            <img src={TargetIcon} alt="" />
            <span>{assets.targetNum} Targets</span>
          </div>
        </div>
        <p className={cx('divider')}></p>
        <div className={cx('game-balance')}>
          <div className={cx('title')}>Game</div>
          <div className={cx('desc')}>
            <img src={TargetIcon} alt="" />
            <span>{userInfo.gold} Targets</span>
          </div>
        </div>
      </div>

      <div className={cx('deposit-target')}>Deposit Target</div>
      <div className={cx('address-container')}>
        <div className={cx('panel')}>
          <div className={cx('tip')}>From Wallet</div>
          <div className={cx('detail')}>
            <img src={BnbLogoIcon} alt="" />
            <div>
              <div className={cx('name')}>BNB Network</div>
              <div className={cx("address")}>{account}</div>
            </div>
          </div>
        </div>
        <div className={cx(['transfer', 'divider'])}>
          <ArrowRightOutlined color='#1a1a1a' />
        </div>
        <div className={cx('panel')}>
          <div className={cx('tip')}>From Wallet</div>
          <div className={cx('detail')}>
            <img src={BnbLogoIcon} alt="" />
            <div>
              <div className={cx('name')}>Game address</div>
              <div className={cx('address')}>{GAME_ADDRESS}</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{marginTop: '40px'}}>Amount</div>
      <div className={cx('deposit-input-container')}>
        <Input.Search
          size="large"
          value={amount}
          onChange={handleNumChange}
          className="deposit-input"
          enterButton="Max"
          onSearch={() => setAmount(max)}
        />
        <div className={cx('divider')}></div>
      </div>
      <div className={cx('btn-container')}>
        <Button
          loading={loading}
          disabled={disabled}
          className='deposit-confirm-btn'
          type="primary"
          onClick={handleTransfer}
        >
          Confirm
        </Button>
      </div>
    </div>
  )
}

export default Deposit