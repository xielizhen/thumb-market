import React from 'react';
import classNames from 'classnames/bind';

import styles from './index.module.scss';

const cx = classNames.bind(styles);

const Filter: React.FC = () => {
  return (
    <div className={cx('container')}>filter</div>
  )
}

export default Filter;