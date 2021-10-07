import React from "react";
import { Input, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons'
import classNames from "classnames/bind";
import { useAccount } from "state/account/hooks";

import styles from './index.module.scss';
import { useWeb3React } from "@web3-react/core";

const cx = classNames.bind(styles);

const Deposit: React.FC = () => {
  const { account } = useWeb3React()
  const { assets } = useAccount()
  const onSearch = () => {

  }

  return (
    <div className={cx('deposit-container')}>

      <div className={cx('balance')}>
        <div className={cx('wallet-balance')}>
          <div className={cx('title')}>Wallet</div>
          <div className={cx('desc')}>
            <img src="" alt="" />
            <span>{assets.targetNum} Targets</span>
          </div>
        </div>
        <div className={cx('game-balance')}>
          <div className={cx('title')}>Game</div>
          <div className={cx('desc')}>
            <img src="" alt="" />
            <span>10 Targets</span>
          </div>
        </div>
      </div>

      <div className={cx('deposit-target')}>Deposit Target</div>
      <div className={cx('address-container')}>
        <div className={cx('panel')}>
          <div className={cx('tip')}>from address</div>
          <div className={cx('detail')}>
            <img src="" alt="" />
            <div>
              <div className={cx('name')}>BNB Network</div>
              <div className={cx("address")}>{account}</div>
            </div>
          </div>
        </div>
        <div className={cx('transfer')}>
          <ArrowRightOutlined color='#1a1a1a' />
        </div>
        <div className={cx('panel')}>
          <div className={cx('tip')}>From Wallet</div>
          <div className={cx('detail')}>
            <img src="" alt="" />
            <div>
              <div className={cx('name')}>Game address</div>
              <div className={cx('address')}>dkaekdldiaidddfjaskfjsdaf000</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{marginTop: '40px'}}>Amount</div>
      <div>
        <Input.Search size="large" className="deposit-input" enterButton="Max" onSearch={onSearch} />
      </div>
      <div className={cx('btn-container')}>
        <Button className='deposit-confirm-btn' type="primary">Confirm</Button>
      </div>
    </div>
  )
}

export default Deposit