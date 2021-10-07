import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 18 16" {...props}>
      <title>编组</title>
      <g id="深色版" stroke="none" strokeWidth="1">
        <g id="Marketplace-deposit" transform="translate(-45.000000, -345.000000)">
          <g id="编组" transform="translate(45.000000, 345.000000)">
            <path d="M14.88,0 C15.3,0 15.66,0.392452836 15.66,0.845283024 L15.66,0.845283024 L15.66,3.80377358 L17.22,3.80377358 C17.64,3.80377358 18,4.16603773 18,4.61886792 L18,4.61886792 L18,11.3509434 C18,11.8339623 17.64,12.1962264 17.22,12.1962264 L17.22,12.1962264 L15.66,12.1962264 L15.66,15.154717 C15.66,15.6377358 15.3,16 14.88,16 L14.88,16 L0.779999994,16 C0.36,16 0,15.6075472 0,15.154717 L0,15.154717 L0,0.845283024 C0,0.362264151 0.36,0 0.779999994,0 L0.779999994,0 Z M14.1,1.69056605 L1.56000001,1.69056605 L1.56000001,14.309434 L14.1,14.309434 L14.1,12.1962264 L10.2,12.1962264 C8.06999999,12.1962264 6.3,10.3245283 6.3,8 C6.3,5.70566037 8.04000001,3.80377358 10.2,3.80377358 L10.2,3.80377358 L14.1,3.80377358 L14.1,1.69056605 Z M16.44,5.46415095 L10.17,5.46415095 C8.87999999,5.46415095 7.83,6.61132075 7.83,8 C7.83,9.38867925 8.87999999,10.5358491 10.17,10.5358491 L10.17,10.5358491 L16.44,10.5358491 L16.44,5.46415095 Z M10,7 C10.5384615,7 11,7.45238096 11,8 C11,8.54761904 10.5641026,9 10,9 C9.46153846,9 9,8.54761904 9,8 C9,7.45238096 9.46153846,7 10,7 Z" id="形状结合"></path>
          </g>
        </g>
      </g>
    </Svg>
  );
};

export default Icon;