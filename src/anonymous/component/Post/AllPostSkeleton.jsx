import React, { useState } from 'react';
import { Divider, Skeleton, Space } from 'antd';
import { useTheme } from '../../../context/ThemeContext';
const AllPostSkeleton = () => {
  const { isDarkMode } = useTheme();
  const [active, setActive] = useState(true);
  const [block, setBlock] = useState(true);
  const [size, setSize] = useState('small');
  const [buttonShape, setButtonShape] = useState('round');
  const [avatarShape, setAvatarShape] = useState('circle');
  const skeletonItems = Array.from({ length: 5 });
  return (
    <>
      <div className={isDarkMode ? 'post-boxes' : 'd-post-boxes'}>
        {skeletonItems.map((_, index) => (
          <div key={index}>
            <Space>
              <Skeleton.Avatar
                style={{ backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A', marginTop: '8px' }}
                active={active}
                size={30}
                shape={avatarShape}
              />
              <Skeleton.Input
                style={{
                  width: '200px',
                  marginTop: '8px',
                  backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A'
                }}
                active={active}
                size={size}
              />
            </Space>
            <br />
            <br />
            <Skeleton.Input
              style={{
                width: '200px',
                marginTop: '8px',
                backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A'
              }}
              active={active}
              size={size}
            />
            <br />
            <br />
            <Space>
              <div
                style={{
                  width: size === 'small' ? 450 : size === 'large' ? 100 : 150,
                  height: size === 'small' ? 500 : size === 'large' ? 100 : 150,
                  backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A',
                  borderRadius: 4
                }}
                active={active}
              ></div>
            </Space>

            <Divider
              style={{ backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
              active={active}
              size={size}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default AllPostSkeleton;
