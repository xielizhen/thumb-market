import React, { useMemo } from 'react';
import classNames from 'classnames/bind';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { useAccount } from 'state/account/hooks'
import { BitBowTypes } from 'utils/icon'

import TargetIcon from 'assets/target.webp';
import ArrowsIcon from 'assets/arrows.webp';
import BnbIcon from 'assets/bnbLogo.webp';
import styles from './index.module.scss'

const cx = classNames.bind(styles);

const AccountAssets: React.FC = () => {
  const { account } = useWeb3React()
  const accountEllipsis = useMemo(() => {
    return account
      ? `${account.substring(0, 6)}...${account.substring(account.length - 6)}`
      : null
  },
    [account]
  )
  const { assets, formAssets } = useAccount()

  return (
    <div className={cx('assets-container')}>
      <div className={cx('header')}>
        <div className={cx('title')}>Wallet</div>
        <div className={cx('account')}>Metamask：{accountEllipsis}</div>
      </div>
      <div className={cx('panels')}>
        <div className={cx('panel')}>
          <div className={cx('img')}>
            <img src={ArrowsIcon} alt="" />
          </div>
          <div className={cx('name')}>{assets.arrowNum} Arrows</div>
        </div>
        <div className={cx('panel')}>
          <div className={cx('img')}>
            <img src={TargetIcon} alt="" />
          </div>
          <div className={cx('name')}>{assets.targetNum} Targets</div>
        </div>
        <div className={cx('panel')}>
          <div className={cx('img')}>
            <img src={BnbIcon} alt="" />
          </div>
          <div className={cx('name')}>{new BigNumber(assets.BNBNum).toFixed(3)} BNB</div>
        </div>
      </div>

      <div className={cx('panels')}>
        {
          BitBowTypes.map((item) => (
            <div className={cx('panel')} key={item.value}>
              <div className={cx('img')}>
                <img src={item.imgSrc} alt="" />
              </div>
              <div className={cx('name')}>
                {formAssets.find(o => o.type === item.value)?.assets.length || 0} {item.label}s
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default AccountAssets