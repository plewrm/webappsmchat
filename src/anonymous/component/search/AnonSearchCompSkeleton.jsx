import React from 'react';
import { Skeleton } from 'antd';
import style from '../../../components/search/Search.module.css';

const AnonSearchCompSkeleton = () => {
  const skeletonItems = Array.from({ length: 20 });
  return (
    <>
      {skeletonItems.map((_, index) => (
        <div key={index} className={style.searchPeopleBox}>
          <div style={{ marginLeft: '15px', marginBottom: '8px' }}>
            <Skeleton.Avatar
              active
              size={50}
              shape="circle"
              style={{ backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
            />
          </div>
          <div>
            <Skeleton.Input
              active
              size={20}
              style={{ width: 100, backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default AnonSearchCompSkeleton;
