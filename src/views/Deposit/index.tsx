import React, { useMemo, useState } from "react";
import { Input, Button, notification } from 'antd';
import classNames from "classnames/bind";
import { useAccount, useUpdateAllAssets, useUpdateUserInfo } from "state/account/hooks";
import { useWeb3React } from "@web3-react/core";
import { getTargetContract } from 'utils/contractHelpers'
import useWeb3 from "hooks/useWeb3";
import { GAME_ADDRESS } from "config";

import ConfirmBtn from "components/ConfirmBtn";

import TargetIcon from 'assets/target.webp';
import BnbLogoIcon from 'assets/bnbLogo.webp';
import TransferIcon from 'assets/transfer.webp';
import styles from './index.module.scss';

const gameAccountEllipsis = GAME_ADDRESS
  ? `${GAME_ADDRESS.substring(0, 6)}...${GAME_ADDRESS.substring(GAME_ADDRESS.length - 6)}`
  : null

const cx = classNames.bind(styles);

const Deposit: React.FC = () => {
  const { account } = useWeb3React()
  const { assets, userInfo } = useAccount()
  const web3 = useWeb3()
  const [amount, setAmount] = useState<string | number>('')
  const [loading, setLoading] = useState(false)
  const { updateUserInfo } = useUpdateUserInfo()
  const { updateAllAssets } = useUpdateAllAssets()

  const disabled = useMemo(() => {
    return Number(amount) <= 0
  }, [amount])

  const max = useMemo(() => {
    return assets.targetNum > 1 ? assets.targetNum : 0
  }, [assets.targetNum])

  const accountEllipsis = useMemo(() => {
    return account
      ? `${account.substring(0, 6)}...${account.substring(account.length - 6)}`
      : null
  }, [account])

  const handleNumChange = (e) => {
    const val = parseFloat(e.target.value)
    if (isNaN(val)) return setAmount('')
    if (val < 0) return setAmount('')
    if (val > max) return setAmount(max)
    return setAmount(val)
  }

  const handleTransfer = async () => {
    try {
      setLoading(true)
      await getTargetContract(web3).methods.transfer(GAME_ADDRESS, amount).send({
        from: account
      })

      // 更新store中的arrow和game中的余额
      updateAllAssets()
      updateUserInfo()
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

  return (
    <div className={cx('deposit-container')}>
      {/* targets 信息 */}
      <div className={cx('left')}>
        <div className={cx('title')}>Wallet</div>
        <div className={cx('img')}>
          <img className={cx('icon')} src={TargetIcon} alt='TargetIcon' />
        </div>
        <div className={cx('name')}>Targets</div>
        <div className={cx('num')}>{assets.targetNum}</div>
      </div>

      {/* game和transfer */}
      <div className={cx('right')}>

        <div className={cx('panel')}>
          <div className={cx('panel-title')}>Game</div>
          <div className={cx('game', 'panel-content')}>
            <div className={cx('opacity-bg')} />
            <div className={cx('game-left')}>
              <img className={cx('icon')} src={TargetIcon} alt="TargetIcon" />
              <span className={cx('num')}>{userInfo.gold}</span>
            </div>
            <p className={cx('game-right')}>Targets</p>
          </div>
        </div>

        <div className={cx('panel')}>
          <div className={cx('panel-title')}>Deposit Target</div>
          <div className={cx('deposit-target', 'panel-content')}>

            <div className={cx('transfer-item', 'from')}>
              <div className={cx('opacity-bg')} />
              <div className={cx('title')}>From Wallet</div>
              <div className={cx('info')}>
                <img className={cx('icon')} src={BnbLogoIcon} alt="BnbLogoIcon" />
                <span className={cx('name')}>Your Wallet</span>
              </div>
              <div className={cx('addr')}>{accountEllipsis}
              </div>
            </div>

            <img className={cx('transfer-icon')} src={TransferIcon} alt="TransferIcon" />

            <div className={cx('transfer-item', 'to')}>
              <div className={cx('opacity-bg')} />
              <div className={cx('title')}>From Wallet</div>
              <div className={cx('info')}>
                <img className={cx('icon')} src={TargetIcon} alt="TargetIcon" />
                <span className={cx('name')}>Game Wallet</span>
              </div>
              <div className={cx('addr')}>{gameAccountEllipsis}
              </div>
            </div>
          </div>
        </div>

        <div className={cx('panel')}>
          <div className={cx('panel-title')}>Targets</div>
          <div className={cx('targets', 'panel-content')}>
            <Input.Search
              size="large"
              value={amount}
              onChange={handleNumChange}
              className="deposit-input"
              enterButton="Max"
              onSearch={() => setAmount(max)}
            />
            <div className={cx('target-max')}>{assets.targetNum} Targets</div>
          </div>
        </div>
      </div>
      <ConfirmBtn
        title="Confirm"
        loading={loading}
        disabled={disabled}
        onClick={handleTransfer}
        style={{
          position: 'absolute',
          bottom: '-50px',
          left: '50%',
          width: '360px',
          height: '100px',
          transform: 'translateX(-50%)'
        }}
      />
    </div>
  )
}

export default Deposit