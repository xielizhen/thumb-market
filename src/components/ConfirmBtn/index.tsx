import { CSSProperties } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import classNames from 'classnames/bind'

import styles from './index.module.scss'

const cx = classNames.bind(styles)

export enum EnumBtnType {
  BIG = 'big',
  SMALL = 'small'
}

interface IProps {
  title: string;
  onClick: () => Promise<void> | void;
  btnType?: EnumBtnType,
  disabled?: boolean,
  loading?: boolean,
  style?: CSSProperties,
  className?: string
}

const ConfirmBtn: React.FC<IProps> = ({
  title,
  btnType = EnumBtnType.BIG,
  onClick,
  disabled = false,
  loading = false,
  className,
  style
}) => {
  return (
    <div
      onClick={() => !disabled && onClick()}
      className={cx('btn', { disabled }, className, btnType)}
      style={style}
    >
      { loading && <LoadingOutlined style={{marginRight: '10px'}} /> }
      { title }
    </div>
  )
}

export default ConfirmBtn