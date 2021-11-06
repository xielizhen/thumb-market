import React from 'react'
import { Modal } from 'antd';
import CloseIcon from 'assets/close.webp';

import WalletCard from '../WalletCard';
import { Login } from '../../types';
import connectors from '../../config';

import styles from './index.module.scss';

interface IProps {
  visible: boolean;
  onCancel: () => void;
  login: Login,
  onDismiss?: () => void
}

const ConnectModal: React.FC<IProps> = ({ visible, onCancel, login, onDismiss = () => null }) => {
  return (
    <Modal
      wrapClassName='connect-wallet-modal'
      title={null}
      width={467}
      visible={visible}
      footer={null}
      closable
      closeIcon={
        <img src={CloseIcon} alt="" />
      }
      onCancel={onCancel}
    >
      <div className={styles.content}>
        <div className={styles.title}>connect wallet</div>
        <div className={styles.connectors}>
          {
            connectors.map((item) => (
              <WalletCard
                login={login}
                onDismiss={onDismiss}
                walletConfig={item} key={item.title}
              />
            ))
          }
        </div>
      </div>
    </Modal>
  )
}

export default ConnectModal;