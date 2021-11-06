import { useWeb3React } from "@web3-react/core";
import { notification } from "antd";
import classNames from "classnames/bind";
import EquimentItem from "components/EquimentItem";
import useApproveArrow from "hooks/useApproveArrow";
import useWeb3 from "hooks/useWeb3";
import { StoreAsset } from "state/types"
import { getBitBowStoreAddress } from 'utils/addressHelpers';
import ConfirmBtn, { EnumBtnType } from "components/ConfirmBtn";
import { getStoreContract } from "utils/contractHelpers";

import MoneyIcon from 'assets/money.webp';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

interface IProps {
  assets: StoreAsset[],
  updateAssets?: (id: string) => void
}

const MarketList: React.FC<IProps> = ({ assets, updateAssets }) => {
  const { account } = useWeb3React()
  const web3 = useWeb3()
  const { loading, handleApprove, isApproved } = useApproveArrow(getBitBowStoreAddress())

  const handleBuy = async (tokenId: string) => {
    try {
      const res = await getStoreContract(web3).methods.buy(tokenId).send({
        from: account,
        gas: 500000
      })

      notification.success({
        message: 'Buy Success',
        className: 'notification-success'
      })

      // 从storelist列表删除
      updateAssets(tokenId)
    } catch (e: any) {
      notification.error({
        message: 'Error',
        description: e?.message,
        className: 'notification-error'
      })
    }
  }


  const handleDelist = async (tokenId: string) => {
    try {
      const res = await getStoreContract(web3).methods.unlock(tokenId).send({
        from: account,
        gas: 500000
      })

      notification.success({
        message: 'Delist Success',
        className: 'notification-success'
      })

      // 从storelist列表删除
      updateAssets(tokenId)
    } catch (e: any) {
      notification.error({
        message: 'Error',
        description: e?.message,
        className: 'notification-error'
      })
    }
  }

  return (
    <div className={cx('panels')}>
      {assets.map(asset => (
        <div className={cx('panel')} key={asset.id}>
          <EquimentItem
            type={asset.type}
            quality={asset.displayProperties.quality}
            imgUrl={asset.imgSrc}
            properties={asset.displayProperties}
          />
          <div className={cx('price-container')}>
            <div className={cx('left')}>
              <img src={MoneyIcon} alt="money icon" />Price
            </div>
            <div className={cx('num')}>{asset.price}</div>
          </div>
          {
            account ? (
              asset.owner === account
                ? <ConfirmBtn
                  style={{ marginTop: '28px' }}
                  btnType={EnumBtnType.SMALL}
                  onClick={() => handleDelist(asset.id)}
                  title="Delist"
                />
                : isApproved
                  ? <ConfirmBtn
                    style={{ marginTop: '28px' }}
                    btnType={EnumBtnType.SMALL}
                    onClick={() => handleBuy(asset.id)}
                    title="Buy"
                  />
                  : <ConfirmBtn
                    style={{ marginTop: '28px' }}
                    loading={loading}
                    btnType={EnumBtnType.SMALL}
                    onClick={handleApprove}
                    title="Approve it"
                  />
            ) : ''
          }
        </div>
      ))}
    </div>
  )
}

export default MarketList