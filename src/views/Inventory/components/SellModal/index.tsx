import React from 'react';
import { Modal, Input, Button } from 'antd';
import classNames from 'classnames/bind';

import styles from './index.module.scss'

const cx = classNames.bind(styles)

interface IProps {
  visible: boolean
}
const SellModal: React.FC<IProps> = ({ visible = true }) => {
  return (
    <Modal
      className='sell-modal'
      title="Sell Death Bow"
      centered
      footer={null}
      visible={visible}
      // onOk={this.hideModal}
      // onCancel={this.hideModal}
      okText="确认"
      cancelText="取消"
    >
      <div className={cx('content')}>
        <div className={cx('img')}></div>
        <label className={cx('input')}>
          price
          <Input className={cx('sell-input')} style={{margin: '0 16px'}} />
          arrows
        </label>
        <Button style={{marginTop: '48px'}} type="primary">List it on market</Button>
      </div>
    </Modal>
  )
}

export default SellModal