import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Skeleton } from 'antd';
import styles from './Search.module.css';

const SearchSkeleton = () => {
  const { isDarkMode } = useTheme();
  const [active, setActive] = useState(true);
  const [block, setBlock] = useState(true);
  const [size, setSize] = useState('small');
  const [buttonShape, setButtonShape] = useState('round');
  const [avatarShape, setAvatarShape] = useState('circle');
  return (
    <div className={styles['custom-skeleton']}>
      <Skeleton.Avatar
        className={styles['ant-skeleton-avatar']}
        style={{ backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
        active={active}
        size={58}
        shape={avatarShape}
      />
      <Skeleton
        title={false}
        paragraph={{
          rows: 2,
          // className: styles['ant-skeleton-paragraph']
          className: `${styles['ant-skeleton-paragraph']} ${isDarkMode ? styles['red'] : styles['yellow']}`
        }}
      />
    </div>
  );
};

export default SearchSkeleton;
