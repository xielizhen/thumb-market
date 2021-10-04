import React from 'react'
import { Modal } from 'antd';

import WalletCard from '../WalletCard';
import { Login } from '../../types';
import connectors from '../../config';

interface IProps {
  visible: boolean;
  onCancel: () => void;
  login: Login,
  onDismiss?: () => void
}

const ConnectModal: React.FC<IProps> = ({ visible, onCancel, login, onDismiss = () => null }) => {
  return (
    <Modal
      width={320}
      title={
        <b style={{ fontSize: '20px' }}>Connect wallet</b>
      }
      visible={visible}
      footer={null}
      onCancel={onCancel}
    >
      {
        connectors.map((item) => (
          <WalletCard
            login={login}
            onDismiss={onDismiss}
            walletConfig={item} key={item.title}
          />
        ))
      }
    </Modal>
  )
}

export default ConnectModal;