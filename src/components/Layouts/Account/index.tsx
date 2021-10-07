import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import { useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core';
import Wallet from 'widgets/WalletModal';
import { NavLink } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { useAllAssets } from 'state/account/hooks';
import { getThumbAccount } from 'services/api';

import HeadImg from 'assets/head.webp';
import { AssetsIcon } from 'components/Svg';
import styles from './index.module.scss';
import config from '../config'

const cx = classNames.bind(styles);

const Account: React.FC = ({ children }) => {
  const accountRoutes = config.find(o => o.href === '/account')?.items || []
  const location = useLocation();
  const { account } = useWeb3React();
  const { login, logout } = useAuth();
  useAllAssets();

  useEffect(() => {
    if (account) {
      getThumbAccount(account)
    }
  }, [account])

  return (
    <div className={cx('account-container')}>
      <div className={cx('left')}>
        <div className={cx('info-container')}>
          {
            account ? (
              <>
                <img className={cx('head')} src={HeadImg} />
                <p className={cx('name')}>Tina</p>
                <p className={cx('email')}>tina00@email.com</p>
              </>
            ) : (
              <>
                <p className={cx('started')}>Get Started</p>
                <p className={cx('icon-container')}>
                  <AssetsIcon width="30px" />
                </p>
              </>
            )
          }
          <Wallet style={{ margin: '20px 0 30px' }} login={login} logout={logout} account={account} />
        </div>
        <div className={cx('router-container')}>
          {
            accountRoutes.map((route) => {
              const IconElement = route.icon
              const isActive = route.href === location.pathname
              return (
                <NavLink key={route.label} className={cx('link', { 'active': isActive })} to={route.href}>
                  <IconElement style={{ marginRight: '12px' }} width="18px" fill={isActive? '#63CCEA': '#9F9F9F'} />
                  {route.label}
                </NavLink>
              )
            })
          }
        </div>

      </div>
      <div className={cx('right')}>
        {children}
      </div>
    </div>
  )
}

export default Account;