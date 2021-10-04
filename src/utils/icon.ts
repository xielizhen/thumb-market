import md5 from 'js-md5';

export enum BitBowTypeEnum {
  ARROW = 1,
  SWORD = 2,
  MIRROR = 3,
  HAND = 4
}
export interface IPropertiesRule {
  id: string,
  type: BitBowTypeEnum,
  properties: {
    [key: string]: any
  }
}

export const BitBowTypes = [BitBowTypeEnum.ARROW, BitBowTypeEnum.SWORD, BitBowTypeEnum.MIRROR, BitBowTypeEnum.HAND]
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
      case BitBowTypeEnum.ARROW: 
        propertyRules = ['quality', 'drawAnimRate', 'weight', 'stability', 'model', 'color1', 'color2', 'color3']
        break;
      case BitBowTypeEnum.SWORD:
        propertyRules = ['quality', 'windResist', 'model', 'color1', 'color2', 'color3']
        break;
      case BitBowTypeEnum.MIRROR:
        propertyRules = ['quality', 'fov', 'model', 'color1', 'color2', 'color3']
        break;
      case BitBowTypeEnum.HAND:
        propertyRules = ['quality', 'coinBonus', 'expBonus', 'model', 'color1', 'color2']
        break;
    }
    const res = propertyRules.reduce((acc, curr, idx) => {
      acc[curr] = properties[idx]
      return acc
    }, {})
    return {
      type,
      id,
      properties: res
    }
  }
}

export default util