import React from 'react';
import { Modal, Button } from 'antd';
import { connectorLocalStorageKey } from 'utils/types';
import classNames from 'classnames/bind';
import OpenNewIcon from "components/Svg/Icons/OpenNew";

import CopyToClipboard from 'components/CopyToClipboard';

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
      width={560}
      title={
        <b style={{ fontSize: '20px' }}>Your wallet</b>
      }
      visible={visible}
      footer={null}
      onCancel={onCancel}
    >
      <div className={cx('account')}>{account}</div>
      <div className={cx('info')}>
        <a className={cx('view')} rel="noreferrer" href={`https://bscscan.com/address/${account}`} target="_blank">
          View on BscScan
          <OpenNewIcon width="20px" />
        </a>
        <CopyToClipboard toCopy={account}>Copy Address</CopyToClipboard>
      </div>
      <div className={cx('logout')}>
        <Button
          type="primary"
          ghost
          onClick={() => {
            logout();
            window.localStorage.removeItem(connectorLocalStorageKey);
            onDismiss();
          }}
        >
          Logout
        </Button>
      </div>
    </Modal>
  )
}

export default AccountModal;