import React from 'react';
import { Modal } from 'antd';
import { connectorLocalStorageKey } from 'utils/types';
import classNames from 'classnames/bind';
import { OpenNewIcon } from "components/Svg";

import CopyToClipboard from 'components/CopyToClipboard';
import CloseIcon from 'assets/close.webp';

import styles from './index.module.scss';
const cx = classNames.bind(styles);

interface IProps {
  visible: boolean;
  onCancel: () => void;
  logout: () => void;
  account: string;
  onDismiss?: () => void
}

const AccountModal: React.FC<IProps> = ({ visible, onCancel, logout, onDismiss, account }) => {
  return (
    <Modal
      wrapClassName="account-wallet-modal"
      width={560}
      title={null}
      visible={visible}
      footer={null}
      closable
      closeIcon={
        <img src={CloseIcon} alt='' />
      }
      onCancel={onCancel}
    >
      <div className={cx('content')}>
        <div className={cx('title')}>Your wallet</div>
        <div className={cx('body')}>
          <div className={cx('account')}>Add: {account}</div>
          <div className={cx('info')}>
            <a className={cx('view')} href={`https://bscscan.com/address/${account}`} target="_blank">
              View on BscScan
              <OpenNewIcon width="20px" />
            </a>
            <CopyToClipboard toCopy={account}>Copy Address</CopyToClipboard>
          </div>
          <div className={cx('logout-container')}>
            <a
              className={cx('logout')}
              onClick={() => {
                logout();
                window.localStorage.removeItem(connectorLocalStorageKey);
                onDismiss();
              }}
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AccountModal;