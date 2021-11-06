import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import { Button } from 'antd';

import styles from './index.module.scss';
import { Login } from './types'
import ConnectWallet from './components/ConnectWallet';
import AccountModal from './components/AccountModal';

const cx = classNames.bind(styles);

interface IProps {
  account?: string;
  login: Login;
  logout: () => void;
  onDismiss?: (account: string) => void;
  className?: string;
  style?: CSSProperties;
}

const Wallet: React.FC<IProps> = ({ login, logout, onDismiss, account, ...props }) => {
  const [connectModalVisible, setConnectModalVisible] = useState(false)
  const [accountModalVisible, setAccountModalVisible] = useState(false)
  const accountEllipsis = useMemo(() => {
    return account
      ? `${account.substring(0, 6)}...${account.substring(account.length - 6)}` 
      : null}, 
    [account]
  )
  const handleClick = async () => {
    if (account) {
      setAccountModalVisible(true)
    } else {
      setConnectModalVisible(true)
    }
  }

  useEffect(() => {
    onDismiss && onDismiss(account)
  }, [account])

  return (
    <div className={props.className} style={props.style}>
       <Button
        size="small"
        type="primary"
        onClick={handleClick}
        ghost
      >
        { account ? `Add: ${accountEllipsis}` : 'Connect'}
      </Button>
      <AccountModal
        visible={accountModalVisible}
        logout={logout}
        onDismiss={() => { setAccountModalVisible(false); }}
        onCancel={() => setAccountModalVisible(false)}
        account={account}
      />
      <ConnectWallet
        visible={connectModalVisible}
        onCancel={() => setConnectModalVisible(false)}
        login={login}
        onDismiss={() => { setConnectModalVisible(false); }}
      />
    </div>
  )
}

export default Wallet