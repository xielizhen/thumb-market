import React from 'react';
import classNames from 'classnames/bind';
import { useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core';
import Wallet from 'widgets/WalletModal';
import { NavLink } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { useAccount } from 'state/account/hooks';

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
  const { userInfo } = useAccount()

  return (
    <div className={cx('account-container')}>
      <div className={cx('left')}>
        <div className={cx('info-container')}>
          {
            account ? (
              <>
                <img className={cx('head')} src={HeadImg} />
                <p className={cx('name')}>
                  {userInfo.isRegister ? userInfo.name : account.slice(-8)}
                </p>
                {
                  userInfo.isRegister && <p className={cx('email')}>{userInfo.username}</p>
                }
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
        {
          account ? (children): <div className={cx('no-account')}>Please Connect Wallet First!</div>
        }
      </div>
    </div>
  )
}

export default Account;