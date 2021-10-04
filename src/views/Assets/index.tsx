import React from 'react';
import classNames from 'classnames/bind';

import styles from './index.module.scss'

const cx = classNames.bind(styles);

const AccountAssets: React.FC = () => {
  return (
    <div className={cx('assets-container')}>
      <div className={cx('header')}>
        <div className={cx('title')}>Wallet</div>
        <div className={cx('account')}>Metamask：059206…4258feaifnie</div>
      </div>
      <div className={cx('panels')}>
        <div className={cx('panel')}>
          <div className={cx('img')}></div>
          <div className={cx('name')}>100 Arrows</div>
        </div>
        <div className={cx('panel')}>
          <div className={cx('img')}></div>
          <div className={cx('name')}>100 Arrows</div>
        </div>
        <div className={cx('panel')}>
          <div className={cx('img')}></div>
          <div className={cx('name')}>100 Arrows</div>
        </div>
      </div>

      <div className={cx('panels')}>
        <div className={cx('panel')}>
          <div className={cx('img')}></div>
          <div className={cx('name')}>100 Arrows</div>
        </div>
        <div className={cx('panel')}>
          <div className={cx('img')}></div>
          <div className={cx('name')}>100 Arrows</div>
        </div>
        <div className={cx('panel')}>
          <div className={cx('img')}></div>
          <div className={cx('name')}>100 Arrows</div>
        </div>
        <div className={cx('panel')}>
          <div className={cx('img')}></div>
          <div className={cx('name')}>100 Arrows</div>
        </div>
      </div>
    </div>
  )
}

export default AccountAssets