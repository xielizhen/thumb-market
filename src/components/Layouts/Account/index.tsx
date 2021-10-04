import React from 'react';
import { Button } from 'antd';
import classNames from 'classnames/bind';
import { useLocation } from "react-router-dom";

import HeadImg from 'assets/head.webp'
import styles from './index.module.scss';
import config from '../config'
import { NavLink } from 'react-router-dom';

const cx = classNames.bind(styles);

const Account: React.FC = ({ children }) => {
  const accountRoutes = config.find(o => o.href === '/account')?.items || []
  const location = useLocation();

  return (
    <div className={cx('account-container')}>
      <div className={cx('left')}>
        <div className={cx('info-container')}>
          <img className={cx('head')} src={HeadImg} />
          <p className={cx('name')}>Tina</p>
          <p className={cx('email')}>tina00@email.com</p>
          <Button className={cx('btn')} type="primary">password</Button>
        </div>
        <div className={cx('router-container')}>
          {
            accountRoutes.map((route) => (
              <NavLink className={cx('link',{ 'active': route.href === location.pathname })} to={route.href}>
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