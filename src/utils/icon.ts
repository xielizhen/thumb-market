import md5 from 'js-md5';
import ArrowIcon from 'assets/arrow.webp';
import ArmguardIcon from 'assets/armguard.webp';
import BowIcon from 'assets/bow.webp';
import PeepSightIcon from 'assets/peepSight.webp';

export enum BitBowTypeEnum {
  BOW = 1,
  ARROW = 2,
  PEEP_SIGHT = 3,
  ARMGUARD = 4
}
export interface IPropertiesRule {
  id: string,
  label: string,
  type: BitBowTypeEnum,
  properties: {
    [key: string]: any
  }
}

export interface BitBowItem {
  label: string
  value: BitBowTypeEnum,
  imgSrc: string
}

export enum EnumQuality {
  N = 1,
  R = 2,
  SR = 3,
  SSR = 4,
  UR = 5
}
export interface IQualityType {
  label: string
  value: EnumQuality,
  className?: string,
  fill?: string
}

export const QualityTypes: IQualityType[] = [
  {
    label: 'Normal',
    value: EnumQuality.N,
    className: 'n-type',
    fill: '#DBD9DA'
  },
  {
    label: 'Rare',
    value: EnumQuality.R,
    className: 'r-type',
    fill: '#69DC84'
  },
  {
    label: 'Super Rare',
    value: EnumQuality.SR,
    className: 'sr-type',
    fill: '#00A1E0'
  },
  {
    label: 'Super Super Rare',
    value: EnumQuality.SSR,
    className: 'ssr-type',
    fill: '#E099FF'
  },
  {
    label: 'Ultra Rare',
    value: EnumQuality.UR,
    className: 'ur-type',
    fill: '#FFD863'
  }
]

export const BitBowTypes: BitBowItem[] = [
  {
    label: 'Bow',
    value: BitBowTypeEnum.BOW,
    imgSrc: BowIcon
  },
  {
    label: 'Arrow',
    value: BitBowTypeEnum.ARROW,
    imgSrc: ArrowIcon
  },
  {
    label: 'Peep Sight',
    value: BitBowTypeEnum.PEEP_SIGHT,
    imgSrc: PeepSightIcon
  },
  {
    label: 'Armguard',
    value: BitBowTypeEnum.ARMGUARD,
    imgSrc: ArmguardIcon
  }
]
class util {
  public static CalcIcon(type: number, model: number, color1: number, color2: number, color3?: number): string {
    if (type < 1 || type > 4) {
      console.error("type invalid.");
      return "";
    }
    if (model < 1 || model > 10) {
      console.error("model invalid.");
      return "";
    }
    if (color1 < 1 || color1 > 12) {
      console.error("color1 invalid.");
      return "";
    }
    if (color2 < 1 || color2 > 12) {
      console.error("color2 invalid.");
      return "";
    }
    if (type !== 4) {
      if (color3 < 1 || color3 > 12) {
        console.error("color3 invalid.");
        return "";
      }
    }
    else if (color3) {
      console.error("color3 invalid.");
      return "";
    }

    let equipString = ["equip_arch", "equip_arrow", "equip_sight", "equip_hand"];
    let numString = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    let keys = [];
    keys.push(equipString[type - 1]);
    keys.push(numString[model - 1]);
    keys.push(numString[color1 - 1]);
    keys.push(numString[color2 - 1]);
    if (color3)
      keys.push(numString[color3 - 1]);
    let fileName = keys.join("_");
    let v = md5(fileName);
    let relURL = v + ".png";

    return relURL;
  }

  public static PropertyRule (id: string, type: number, properties: string[]): IPropertiesRule {
    let propertyRules = []
    switch(type) {
      case BitBowTypeEnum.BOW: 
        propertyRules = ['quality', 'drawAnimRate', 'weight', 'stability', 'model', 'color1', 'color2', 'color3']
        break;
      case BitBowTypeEnum.ARROW:
        propertyRules = ['quality', 'windResist', 'model', 'color1', 'color2', 'color3']
        break;
      case BitBowTypeEnum.PEEP_SIGHT:
        propertyRules = ['quality', 'fov', 'model', 'color1', 'color2', 'color3']
        break;
      case BitBowTypeEnum.ARMGUARD:
        propertyRules = ['quality', 'coinBonus', 'expBonus', 'model', 'color1', 'color2']
        break;
    }
    const res = propertyRules.reduce((acc, curr, idx) => {
      acc[curr] = properties[idx]
      return acc
    }, {})
    return {
      type,
      label: BitBowTypes.find(o => o.value === type).label,
      id,
      properties: res
    }
  }
}

export default util