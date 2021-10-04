import React from 'react';
import classNames from 'classnames/bind';
import { useLocation } from "react-router-dom";

import MenuLink from './MenuLink';
import styles from './index.module.scss';
import links from '../config';

const cx = classNames.bind(styles);

const Menu: React.FC = () => {
  const location = useLocation();

  const getActive = (link) => {
    const items = link.items
    if (Array.isArray(items)) {
      return items.some(o => o.href === location.pathname)
    } else {
      return link.href === location.pathname
    }
  }

  return (
    <div className={cx('menu')}>
      {
        links.map((entry) => {
          return (
            <div className={cx('menu-item', { 'active': getActive(entry) })} key={entry.label}>
              <MenuLink href={entry.href}>{entry.label}</MenuLink>
            </div>
          )
        })
      }
    </div>
  )
}

export default Menu;