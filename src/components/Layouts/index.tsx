import React from 'react';
import { Layout } from 'antd';
import classnames from 'classnames/bind';
import { useLocation } from 'react-router';

import Menu from './Menu';
import AccountLayout from './Account';
import styles from './index.module.scss';
import logo from 'assets/logo.webp';

const cx = classnames.bind(styles);

const Layouts: React.FC = ({ children }) => {
  const location = useLocation();

  return (
    <Layout className={cx('layout')}>
      <header className={cx('header')}>
        <div className={cx('content-inner')}>
          <a
            className={cx('logo-container')}
            href='http://www.bitbow.net/'
            target="_blank"
            rel="noreferrer"
          >
            <img className={cx('logo')} src={logo} alt='logo' />
          </a>
          <div className={cx('right')}>
            <Menu />
            <a
              className={cx('play-btn')}
              target="_blank"
              href="https://cloud.bitbow.net/web/index.html"
              rel="noreferrer"
            >
              Play now
            </a>
          </div>
        </div>
      </header>
      <main>
        <div className={cx('content-inner')}>
          {
            location.pathname.includes('account')
              ? <AccountLayout> {children}</AccountLayout>
              : children
          }
        </div>
      </main>
    </Layout>
  )
}

export default Layouts