import React from 'react';
import { Layout, Button } from 'antd';
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
        <Button
          style={{marginLeft: '10px'}}
          type="primary"
          href="http://cloud.bitbow.net/web/index.html"
          target="_blank"
          size="large"
          rel="noreferrer"
        >
          Play now
        </Button>
        </div>
      </header>
      <main className={cx('content')}>
        {
          location.pathname.includes('account')
            ? <AccountLayout> { children }</AccountLayout>
            : children
        }
      </main>
    </Layout>
  )
}

export default Layouts