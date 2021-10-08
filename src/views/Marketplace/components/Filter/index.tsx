import React from 'react';
import { Checkbox, Slider } from 'antd';
import classNames from 'classnames/bind';
import { QualityTypes } from 'utils/icon'

import styles from './index.module.scss';

const cx = classNames.bind(styles);
const options = [
  { label: 'For Sale', value: 'Apple' },
  { label: 'Not for Sale', value: 'Pear' }
];

const Filter: React.FC = () => {
  const handleCheckboxChange = () => {

  }

  return (
    <div className={cx('container')}>
      <div className={cx('filter')}>
        <span>Filter</span>
        <span>Clear Filter</span>
      </div>
      <div className={cx('checkbox')}>
        <div className={cx('title')}>Quality</div>
        <Checkbox.Group
          className='market-filter-checkbox'
          options={QualityTypes}
          defaultValue={['Apple']}
          onChange={handleCheckboxChange}
        />
      </div>
      <div className={cx('slider')}>
        <div className={cx('sub-title')}>Weight</div>
        <Slider min={1} max={27} range />
      </div>
      <div className={cx('slider')}>
        <div className={cx('sub-title')}>Stability</div>
        <Slider min={1} max={20} range />
      </div>
      <div className={cx('slider')}>
        <div className={cx('sub-title')}>Draw Speed</div>
        <Slider min={1} max={31} range />
      </div>
      <div className={cx('checkbox')}>
      <div className={cx('title')}>Status</div>
        <Checkbox.Group
          className='market-filter-checkbox'
          options={options}
          defaultValue={['Apple']}
          onChange={handleCheckboxChange}
        />
      </div>
    </div>
  )
}

export default Filter;