import React, { CSSProperties } from 'react';
import classNames from 'classnames/bind';

import styles from './index.module.scss';

const cx = classNames.bind(styles);

interface IProps {
  imgSrc: string,
  imgAlt?: string,
  containerStyle?: CSSProperties,
  imgStyle?: CSSProperties
}

const ImgContainer: React.FC<IProps> = ({
  imgSrc,
  imgAlt,
  containerStyle={},
  imgStyle={}
}) => {
  return (
    <div className={cx('img-container')} style={containerStyle}>
      <img src={imgSrc} alt={imgAlt || ''} style={imgStyle} />
    </div>
  )
}

export default ImgContainer