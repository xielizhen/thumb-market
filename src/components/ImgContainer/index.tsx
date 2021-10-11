import React from 'react';
import classNames from 'classnames/bind';

import styles from './index.module.scss';

const cx = classNames.bind(styles);

interface IProps {
  imgSrc: string,
  imgAlt?: string
}

const ImgContainer: React.FC<IProps> = ({ imgSrc, imgAlt }) => {
  return (
    <div className={cx('img-container')}>
      <img src={imgSrc} alt={imgAlt || ''} />
    </div>
  )
}

export default ImgContainer