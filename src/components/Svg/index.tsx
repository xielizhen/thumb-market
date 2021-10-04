import { SvgProps } from "./types";
import styles from './index.module.scss';

const Svg: React.FC<SvgProps>= ({
  color = 'text',
  fill="#22C5FC",
  width = '20px',
  xmlns = 'http://www.w3.org/2000/svg',
  spin = false,
  children,
  ...otherProps
}) => {
  return (
    <svg
      className={styles.svg}
      color={color}
      fill={fill}
      width={width}
      xmlns={xmlns}
      {...otherProps}
    >
      {children}
    </svg>
  )
}

export default Svg;

