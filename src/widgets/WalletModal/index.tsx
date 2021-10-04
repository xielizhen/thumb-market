import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'antd';
import classNames from 'classnames/bind';

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
      ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` 
      : null}, 
    [account]
  )
  const handleClick = () => {
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
      <Button type="primary" onClick={handleClick}>
        { account ? `${accountEllipsis}` : 'Connect'}
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