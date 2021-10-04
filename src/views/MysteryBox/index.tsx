import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import classNames from 'classnames/bind';

import styles from './index.module.scss';
import giftImg from 'assets/gift.webp'

const cx = classNames.bind(styles);

const MysteryBox: React.FC = () => {
  const [visible, setVisible] = useState(false)

  return (
    <div className={cx('mystery-box')}>
      <img src={giftImg} alt="" />
      <div>
        This blind box contains an unknown bow <br /> Cost for each attempt:100 Targets
      </div>
      <Button size="large" type="primary" onClick={() => setVisible(true)}>Open it</Button>

      <Modal
        className='mystery-modal'
        title="Congratulations！"
        centered
        width={690}
        footer={null}
        visible={visible}
        // onOk={this.hideModal}
        // onCancel={this.hideModal}
        okText="确认"
        cancelText="取消"
      >
        <div className={cx('modal-content')}>
          <div className={cx('info')}>You got a XXX bow from the blind box</div>
          <div className={cx('detail')}>
            <div className={cx('img')}></div>
            <div className={cx('attrs')}>
              <p>Deadly Bow</p>
              <p>Quality：Normal</p>
              <p>Weight：24</p>
            </div>
          </div>
          <Button type="primary" size="large">Great</Button>
        </div>
      </Modal>
    </div>
  )
}

export default MysteryBox