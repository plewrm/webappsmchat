import React from 'react';
import styles from './ComingFeature.module.css';
import { useDispatch } from 'react-redux';
import { setNewFeature } from '../../redux/slices/modalSlice';

const ComingFeature = () => {
  const dispatch = useDispatch();

  const handleCloseFeature = () => {
    dispatch(setNewFeature(false));
  };
  return (
    <div className={styles.featureOverlay} onClick={handleCloseFeature}>
      <div className={styles.featureContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.featureImageContainer}>
          <img src="/Images/comingFeature.png" alt="img" className={styles.featureImage} />
          <button className={styles.close} onClick={handleCloseFeature}>
            &#x2715;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingFeature;
