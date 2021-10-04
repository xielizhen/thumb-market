import React from 'react';
import { Button } from 'antd';
import classNames from 'classnames/bind';
import { useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core';
import Wallet from 'widgets/WalletModal';
import { NavLink } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { useAllAssets } from 'state/account/hooks';

import HeadImg from 'assets/head.webp'
import styles from './index.module.scss';
import config from '../config'

const cx = classNames.bind(styles);

const Account: React.FC = ({ children }) => {
  const accountRoutes = config.find(o => o.href === '/account')?.items || []
  const location = useLocation();
  const { account } = useWeb3React();
  const { login, logout } = useAuth();
  useAllAssets();

  return (
    <div className={cx('account-container')}>
      <div className={cx('left')}>
        <div className={cx('info-container')}>
          <img className={cx('head')} src={HeadImg} />
          <p className={cx('name')}>Tina</p>
          <p className={cx('email')}>tina00@email.com</p>
          {/* <Button className={cx('btn')} type="primary">password</Button> */}
          <Wallet style={{margin: '20px 0 30px'}} login={login} logout={logout} account={account} />
        </div>
        <div className={cx('router-container')}>
          {
            accountRoutes.map((route) => (
              <NavLink className={cx('link', { 'active': route.href === location.pathname })} to={route.href}>
                <img src={route.icon} />
                {route.label}
              </NavLink>
            ))
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