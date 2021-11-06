import classNames from 'classnames/bind'

import styles from './index.module.scss'

const cx = classNames.bind(styles)

interface IProps {
  title: string;
  onClick: () => Promise<void> | void;
  disabled: boolean,
}

const ConfirmBtn: React.FC<IProps> = ({ title, onClick, disabled }) => {
  return (
    <div onClick={() => !disabled && onClick} className={cx('btn', { disabled })}>
      { title }
    </div>
  )
}

export default ConfirmBtn