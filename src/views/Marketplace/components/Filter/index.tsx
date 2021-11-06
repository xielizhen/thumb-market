import React, { useEffect } from 'react';
import { Checkbox, Switch } from 'antd';
import classNames from 'classnames/bind';
import { QualityTypes } from 'utils/icon';
import useForm from 'hooks/useForm';

import styles from './index.module.scss';

const cx = classNames.bind(styles);
interface IProps {
  filterAssets: (values: { [key: string]: any }) => void
}
const Filter: React.FC<IProps>= ({ filterAssets }) => {
  const { values, setFieldValue, clearFieldValue } = useForm({
    quality: [],
    owner: false
  });

  useEffect(() => {
    filterAssets(values)
  }, [values])

  return (
    <div className={cx('container')}>
      <div className={cx('filter')}>
        <span>Filter</span>
        <span onClick={clearFieldValue}>Clear Filter</span>
      </div>
      <div className={cx('panel')}>
        <div className={cx('title')}>Quality</div>
        <Checkbox.Group
          className='market-filter-checkbox'
          options={QualityTypes}
          value={values.quality}
          onChange={(checked) => setFieldValue('quality', checked)}
        />
      </div>
      <div className={cx('panel')} style={{marginTop: '40px'}}>
        <span style={{marginRight: '10px'}}>owner</span>
        <Switch
          checked={values.owner}
          onChange={(checked) => setFieldValue('owner', checked)}
        />
      </div>
    </div>
  )
}

export default Filter;