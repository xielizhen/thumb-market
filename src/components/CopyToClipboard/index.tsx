import React, { useState } from "react";
import classNames from 'classnames/bind';
import { CopyIcon } from 'components/Svg';

import styles from './index.module.scss';

const cx = classNames.bind(styles);

interface IProps {
  toCopy: string;
}

const CopyToClipboard: React.FC<IProps> = ({ toCopy, children, ...props }) => {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);

  const copyToClipboardWithCommand = (content: string) => {
    const el = document.createElement("textarea");
    el.value = content;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  function displayTooltip() {
    setIsTooltipDisplayed(true);
    setTimeout(() => {
      setIsTooltipDisplayed(false);
    }, 1000);
  }

  return (
    <div
      className={cx('copy-container')}
      onClick={() => {
        if (navigator.clipboard && navigator.permissions) {
          navigator.clipboard.writeText(toCopy).then(() => displayTooltip());
        } else if (document.queryCommandSupported("copy")) {
          copyToClipboardWithCommand(toCopy);
          displayTooltip();
        }
      }}
      {...props}
    >
      {children}
      <CopyIcon width="20px" />
      {
        isTooltipDisplayed && <div className={cx('tooltip')}>Copied</div>
      }
    </div>
  );
};

export default CopyToClipboard;
