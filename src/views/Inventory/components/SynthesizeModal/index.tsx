import React from 'react';
import { Modal, Button } from 'antd';
import classNames from 'classnames/bind';

import styles from './index.module.scss'

const cx = classNames.bind(styles)

interface IProps {
  visible: boolean
}
const SynthesizeModal: React.FC<IProps> = ({ visible }) => {
  return (
    <Modal
      className='synthesize-modal'
      title="Synthesize the following items?"
      centered
      width={690}
      footer={null}
      visible={visible}
      // onOk={this.hideModal}
      // onCancel={this.hideModal}
      okText="确认"
      cancelText="取消"
    >
      <div className={cx('content')}>
        <div className={cx('synthesize')}>
          {/* <div className={cx('before')}></div> */}
          <div className={cx('panel')}>
            <div className={cx('img')}></div>
            {/* <div className={cx('divider')}></div> */}
          </div>

          <div className={cx('panel')}>
            <div className={cx('img')}></div>
            {/* <div className={cx('divider')}></div> */}
          </div>

          <div className={cx('panel')}>
            <div className={cx('img')}></div>
            {/* <div className={cx('divider')}></div> */}
          </div>

          <div className={cx('panel')}>
            <div className={cx('img')}></div>
            <div className={cx('text')}>888 Targets</div>
            {/* <div className={cx('divider')}></div> */}
          </div>
          {/* <div className={cx('after')}></div> */}
        </div>
        <div className={cx('dividers')}>
          <div className={cx('inner')}>
            <div className={cx('rect')}></div>
            <div className={cx('rect')}></div>
            <div className={cx('rect')}></div>
          </div>
        </div>
        <div className={cx('divider')}></div>
        <div className={cx('img')}></div>
        <Button style={{ marginTop: '48px' }} type="primary">Do it now</Button>
      </div>
    </Modal>
  )
}

export default SynthesizeModal