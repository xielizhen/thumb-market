import { Spin } from 'antd';
import { CSSProperties } from 'react';

import styles from './index.module.scss';

const Loading: React.FC<{style?: CSSProperties }> = ({ style }) => {
  return (
    <div className={styles.spinContainer} style={style}>
      <Spin />
    </div>
  )
}

export default Loading;