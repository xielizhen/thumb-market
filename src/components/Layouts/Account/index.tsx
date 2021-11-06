import React from 'react';
import classNames from 'classnames/bind';
import { useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core';
import Wallet from 'widgets/WalletModal';
import { NavLink } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { useAccount, useAllAssets, useGetUserInfo } from 'state/account/hooks';

import avtarImg from 'assets/avtar.webp';
import { AssetsIcon } from 'components/Svg';
import styles from './index.module.scss';
import config from '../config'

const cx = classNames.bind(styles);

const Account: React.FC = ({ children }) => {
  useAllAssets();
  useGetUserInfo();
  const accountRoutes = config.find(o => o.href === '/account')?.items || []
  const location = useLocation();
  const { account } = useWeb3React();
  const { login, logout } = useAuth();
  const { userInfo } = useAccount()

  return (
    <div className={cx('account-container')}>
      <div className={cx('account-header')}>
        <div className={cx('info-container')}>
          <>
            <img className={cx('avtar')} src={avtarImg} alt="头像" />
            <div className={cx('info')}>
              <p className={cx('name')}>{userInfo.isRegister ? userInfo.name : account?.slice(-8)}</p>
              {
                  userInfo.isRegister && <p className={cx('email')}>{userInfo.username}</p>
                }
            </div>
          </>
          <div className={cx('no-connect')}>

          </div>
        </div>
        <div className={cx('router-container')}>
        {
            accountRoutes.map((route) => {
              const IconElement = route.icon
              const isActive = route.href === location.pathname
              return (
                <NavLink key={route.label} className={cx('link', { 'active': isActive })} to={route.href}>
                  <IconElement style={{ marginRight: '12px' }} width="18px" fill={isActive? '#FEDD71': '#7474AA'} />
                  {route.label}
                </NavLink>
              )
            })
          }
        </div>
      </div>
      <div className={cx('inner')}>
        {children}
      </div>
    </div>
  )
}

export default Account;