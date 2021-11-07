import { CSSProperties, FC } from 'react'
import classNames from 'classnames/bind'
import { SvgProps } from 'components/Svg'
import { BitBowTypeEnum, QualityTypes } from 'utils/icon'

import { BowIcon, ArrowIcon, PeepSightIcon, ArmguardIcon } from 'components/Svg';

import DrawAnimRateIcon from 'assets/drawAnimRate.webp';
import WeightIcon from 'assets/weight.webp';
import StabilityIcon from 'assets/stability.webp';
import WindResistIcon from 'assets/windResist.webp';
import FovIcon from 'assets/fov.webp';
import CoinBonusIcon from 'assets/coinBonus.png';
import ExpBonusIcon from 'assets/expBonus.png';

import styles from './index.module.scss'

const cx = classNames.bind(styles)

interface config {
  type: BitBowTypeEnum;
  icon: FC<SvgProps>;
  renderProperties?: (properties: { [key: string]: any }) => JSX.Element
}

export const PropertiesByType: config[] = [
  {
    type: BitBowTypeEnum.BOW,
    icon: BowIcon,
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
    icon: ArrowIcon,
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
    icon: PeepSightIcon,
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
    icon: ArmguardIcon,
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

interface IProps {
  type: BitBowTypeEnum,
  quality: number,
  imgUrl: string,
  style?: CSSProperties,
  properties?: {
    [key: string]: any
  }
}

const EquimentItem: FC<IProps> = ({
  type,
  quality,
  imgUrl,
  properties,
  style
}) => {
  const { icon: Icon, renderProperties } = PropertiesByType.find(o => o.type === type)
  const qualityItem = QualityTypes.find(o => +o.value === +quality)
  const { className, fill } = qualityItem

  return (
    <div className={cx('equiment-container', className)} style={style}>
      <Icon className={cx('icon')} fill={fill} />
      <img className={cx({ 'bow': type === BitBowTypeEnum.BOW })} src={imgUrl} alt="equiment" />
      { renderProperties?.(properties)}
    </div>
  )
}

export default EquimentItem