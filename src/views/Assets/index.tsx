import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, notification } from 'antd';
import classNames from 'classnames/bind';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { useAccount } from 'state/account/hooks'
import { BitBowTypes } from 'utils/icon';
import useApproveArrow from 'hooks/useApproveArrow';
import { getBitBowFactoryContract } from 'utils/contractHelpers';
import useWeb3 from 'hooks/useWeb3';
import { fetchClubCount } from 'state/account/fetch';
import { getBitBowFactoryAddress } from 'utils/addressHelpers';

import TargetIcon from 'assets/target.webp';
import ArrowsIcon from 'assets/arrows.webp';
import BnbIcon from 'assets/bnbLogo.webp';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

const AccountAssets: React.FC = () => {
  const web3 = useWeb3()
  const { account } = useWeb3React()
  const { assets, formAssets } = useAccount()
  const accountEllipsis = useMemo(() => {
    return account
      ? `${account.substring(0, 6)}...${account.substring(account.length - 6)}`
      : null
  },
    [account]
  )
  const { loading, handleApprove, disabled, isApproved, setLoading } = useApproveArrow(getBitBowFactoryAddress());

  const [clubCount, setClubCount] = useState(0)

  const getClubCount = useCallback(async () => {
    if (!account) return
    const data = await fetchClubCount(account)
    setClubCount(data)
  }, [account])

  const handleBuyClub = useCallback(async () => {
    try {
      setLoading(true)
      await getBitBowFactoryContract(web3).methods.buyClub().send({
        from: account,
        gas: 500000
      })
      getClubCount()
    } catch (e: any) {
      notification.error({
        message: 'Error',
        description: e?.message
      })
    } finally {
      setLoading(false)
    }
  }, [account, notification, web3])

  useEffect(() => {
    getClubCount()
  },[account])


  return (
    <div className={cx('assets-container')}>
      {/* 钱包信息 */}
      <div className={cx('header')}>Wallet</div>
      <div className={cx('account-info')}>
        <span>Metamask：{accountEllipsis}</span>
        <span
          style={{margin: '0 40px 0 55px'}}>
            Club Count：
            <b style={{ color: '#FEDD71'}}>
              {clubCount}
            </b>
        </span>
        <Button
          size="small"
          loading={loading}
          disabled={disabled}
          type="primary"
          ghost
          onClick={isApproved ? handleBuyClub : handleApprove}
        >
          { isApproved ? 'Buy a club': 'Approve it'}
        </Button>
      </div>

      {/* 余额 */}
      <div className={cx('money-panels')}>
        <div className={cx('money-panel', 'arrows')}>
          <span>Arrows</span>
          <span className={cx('num')}>{assets.arrowNum}</span>
          <img src={ArrowsIcon} alt="arrows img" />
        </div>
        <div className={cx('money-panel', 'target')}>
          <span>Targets</span>
          <span className={cx('num')}>{assets.targetNum}</span>
          <img src={TargetIcon} alt="targets img" />
        </div>
        <div className={cx('money-panel', 'bnb')}>
          <span>BNB</span>
          <span className={cx('num')}>{new BigNumber(assets.BNBNum).toFixed(3)}</span>
          <img src={BnbIcon} alt="bnb img" />
        </div>
      </div>

      {/* 装备数量 */}
      <div className={cx('assets-panels')}>
        {
          BitBowTypes.map((item) => (
            <div className={cx('asset-panel')} key={item.value}>
              <img className={cx('asset-img')} src={item.imgSrc} alt="img" />
              <div className={cx('asset-info')}>
                <div>{item.label}s</div>
                <div className={cx('num')}>{formAssets.find(o => o.type === item.value)?.assets.length || 0}</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default AccountAssets