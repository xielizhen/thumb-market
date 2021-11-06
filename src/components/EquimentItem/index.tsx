import { CSSProperties, FC } from 'react'
import classNames from 'classnames/bind'
import { SvgProps } from 'components/Svg'
import { BitBowTypeEnum, QualityTypes } from 'utils/icon'

import { BowIcon, ArrowIcon, PeepSightIcon, ArmguardIcon } from 'components/Svg'

import styles from './index.module.scss'

const cx = classNames.bind(styles)

interface config {
  type: BitBowTypeEnum;
  icon: FC<SvgProps>;
}

const PropertiesByType: config[] = [
  {
    type: BitBowTypeEnum.BOW,
    icon: BowIcon,
  },
  {
    type: BitBowTypeEnum.ARROW,
    icon: ArrowIcon
  },
  {
    type: BitBowTypeEnum.PEEP_SIGHT,
    icon: PeepSightIcon
  },
  {
    type: BitBowTypeEnum.ARMGUARD,
    icon: ArmguardIcon
  }
]

interface IProps {
  type: BitBowTypeEnum,
  quality: number,
  imgUrl: string,
  style?:CSSProperties,
  properties?: {
    [key: string]: any
  }
}

const EquimentItem: FC<IProps>= ({
  type,
  quality,
  imgUrl,
  properties,
  style
}) => {
  const { icon: Icon } = PropertiesByType.find(o => o.type === type)
  const qualityItem = QualityTypes.find(o => +o.value === +quality)
  const { className, fill } = qualityItem

  return (
    <div className={cx('equiment-container', className )} style={style}>
      <Icon className={cx('icon')} fill={fill} />
      <img className={cx({ 'bow': type === BitBowTypeEnum.BOW })} src={imgUrl} alt="equiment" />
    </div>
  )
}

export default EquimentItem