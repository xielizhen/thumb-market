import React from 'react';
import { Layout } from 'antd';
import classnames from 'classnames/bind';

import Menu from './Menu'
import styles from './index.module.scss';
import logo from 'assets/logo.webp';

const cx = classnames.bind(styles);

const Layouts: React.FC = ({ children }) => {
  return (
    <Layout className={cx('layout')}>
      <header className={cx('header')}>
        <img className={cx('logo')} src={logo} alt='logo' />
        <Menu />
      </header>
      <main className={cx('content')}>
        {children}
      </main>
    </Layout>
  )
}

export default Layouts