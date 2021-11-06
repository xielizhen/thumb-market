import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core';
import Wallet from 'widgets/WalletModal';
import AccountModal from 'widgets/WalletModal/components/AccountModal';
import { NavLink } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { useAccount, useAllAssets, useGetUserInfo } from 'state/account/hooks';

import avtarImg from 'assets/avtar.webp';
import personalImg from 'assets/personal.webp';
import styles from './index.module.scss';
import config from '../config'
import { DownOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

const Account: React.FC = ({ children }) => {
  useAllAssets();
  useGetUserInfo();
  const accountRoutes = config.find(o => o.href === '/account')?.items || []
  const location = useLocation();
  const { account } = useWeb3React();
  const { login, logout } = useAuth();
  const { userInfo } = useAccount();

  const [accountModalVisible, setAccountModalVisible] = useState(false);

  return (
    <div className={cx('account-container')}>
      <div className={cx('account-header')}>
        <div className={cx('info-container')}>
          {
            account ? (
              <>
                <img className={cx('avtar')} src={avtarImg} alt="avtar" />
                <div className={cx('info')}>
                  <p className={cx('name')}>
                    {userInfo.isRegister ? userInfo.name : account?.slice(-8)}
                    <DownOutlined
                      style={{ marginLeft: '24px', cursor: 'pointer' }}
                      onClick={() => setAccountModalVisible(true)}
                    />
                  </p>
                  {
                    userInfo.isRegister && <p className={cx('email')}>{userInfo.username}</p>
                  }
                </div>
              </>
            ) : (
              <>
                <img className={cx('avtar')} src={personalImg} alt="personal" />
                <div className={cx('info')}>
                  <p className={cx('name')}>Please sign in</p>
                  <Wallet
                    login={login}
                    logout={logout}
                    account={account}
                    style={{ marginTop: '12px' }}
                  />
                </div>
              </>
            )
          }
        </div>
        <div className={cx('router-container')}>
          {
            accountRoutes.map((route) => {
              const IconElement = route.icon
              const isActive = route.href === location.pathname
              return (
                <NavLink key={route.label} className={cx('link', { 'active': isActive })} to={route.href}>
                  <IconElement style={{ marginRight: '12px' }} width="18px" fill={isActive ? '#FEDD71' : '#7474AA'} />
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
      <AccountModal
        visible={accountModalVisible}
        logout={logout}
        onDismiss={() => { setAccountModalVisible(false); }}
        onCancel={() => setAccountModalVisible(false)}
        account={account}
      />
    </div>
  )
}

export default Account;