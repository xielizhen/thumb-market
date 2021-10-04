import React from "react";
import classNames from "classnames/bind";
import { connectorLocalStorageKey } from "utils/types";
import { Login, Config } from "../../types";
import styles from './index.module.scss'

const cx = classNames.bind(styles)

interface Props {
  walletConfig: Config;
  login: Login;
  onDismiss: () => void;
}

const WalletCard: React.FC<Props> = ({ login, walletConfig, onDismiss }) => {
  const { title, icon: Icon } = walletConfig;
  return (
    <div
      className={cx('card')}
      onClick={() => {
        login(walletConfig.connectorId);
        window.localStorage.setItem(connectorLocalStorageKey, walletConfig.connectorId);
        onDismiss()
      }}
      id={`wallet-connect-${title.toLocaleLowerCase()}`}
    >
      <div className={cx('card-title')}>{title}</div>
      <Icon width="32px" />
    </div>
  );
};

export default WalletCard;
