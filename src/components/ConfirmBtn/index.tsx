import { CSSProperties } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import classNames from 'classnames/bind'

import styles from './index.module.scss'

const cx = classNames.bind(styles)

interface IProps {
  title: string;
  onClick: () => Promise<void> | void;
  disabled?: boolean,
  loading?: boolean,
  style?: CSSProperties,
  className?: string
}

const ConfirmBtn: React.FC<IProps> = ({
  title,
  onClick,
  disabled = false,
  loading = false,
  className,
  style
}) => {
  return (
    <div
      onClick={() => !disabled && onClick()}
      className={cx('btn', { disabled }, className)}
      style={style}
    >
      { loading && <LoadingOutlined style={{marginRight: '10px'}} /> }
      { title }
    </div>
  )
}

export default ConfirmBtn