import { BitBowTypeEnum } from 'utils/icon';
import classNames from 'classnames/bind';

import DrawAnimRateIcon from 'assets/drawAnimRate.webp';
import WeightIcon from 'assets/weight.webp';
import StabilityIcon from 'assets/stability.webp';
import WindResistIcon from 'assets/windResist.webp';
import FovIcon from 'assets/fov.webp';
import CoinBonusIcon from 'assets/coinBonus.webp';
import ExpBonusIcon from 'assets/expBonus.webp';

import styles from './index.module.scss';

const cx = classNames.bind(styles);

interface config {
  type: BitBowTypeEnum;
  renderProperties: (properties: { [key: string]: any }) => JSX.Element
}

const PropertiesByType: config[] = [
  {
    type: BitBowTypeEnum.BOW,
    renderProperties: (properites) => {
      return (
        <div className={cx('properties', 'bow')}>
          <div className={cx('item')}>
            <img src={DrawAnimRateIcon} alt="DrawAnmiRateIcon" />
            <span>{properites.drawAnimRate}</span>
          </div>
          <div className={cx('item')}>
            <img src={WeightIcon} alt="WeightIcon" />
            <span>{properites.weight}</span>
          </div>
          <div className={cx('item')}>
            <img src={StabilityIcon} alt="StabilityIcon" />
            <span>{properites.stability}</span>
          </div>
        </div>
      )
    }
  },
  {
    type: BitBowTypeEnum.ARROW,
    renderProperties: (properites) => {
      return (
        <div className={cx('properties')}>
          <div className={cx('item')}>
            <img src={WindResistIcon} alt="WindResistIcon" />
            <span>{properites.windResist}</span>
          </div>
        </div>
      )
    }
  },
  {
    type: BitBowTypeEnum.PEEP_SIGHT,
    renderProperties: (properites) => {
      return (
        <div className={cx('properties')}>
          <div className={cx('item')}>
            <img src={FovIcon} alt="FovIcon" />
            <span>{properites.fov}</span>
          </div>
        </div>
      )
    }
  },
  {
    type: BitBowTypeEnum.ARMGUARD,
    renderProperties: (properites) => {
      return (
        <div className={cx('properties')}>
          <div className={cx('item')}>
            <img src={CoinBonusIcon} alt="CoinBonusIcon" />
            <span>{properites.coinBonus}</span>
          </div>
          <div className={cx('item')}>
            <img src={ExpBonusIcon} alt="ExpBonusIcon" />
            <span>{properites.expBonus}</span>
          </div>
        </div>
      )
    }
  }
]


const Properties: React.FC<{
    type: BitBowTypeEnum,
    properties: {[key: string]: any}
}> = ({ type, properties}) => {
  const { renderProperties } = PropertiesByType.find(o => +o.type === +type)
  return (
    <>
      {renderProperties?.(properties)}
    </>
  )
}

export default Properties