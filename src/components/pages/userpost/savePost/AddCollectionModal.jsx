import React, { useState } from 'react';
import styles from './SavePostsModal.module.css';
import { useTheme } from '../../../../context/ThemeContext';
import { useDispatch } from 'react-redux';
import { setAddCollectionModal } from '../../../../redux/slices/modalSlice';
import { BASE_URL, BEARER_TOKEN, CREATECOLLECTION } from '../../../../api/EndPoint';
import axios from 'axios';

const AddCollectionModal = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();

  const [collectionValue, setCollectionValue] = useState('');

  const handleCloseAddCollection = () => {
    dispatch(setAddCollectionModal(false));
  };

  const handleCollectionInput = (e) => {
    const value = e.target.value;
    setCollectionValue(value);
  };

  const createCollection = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(
        `${BASE_URL}${CREATECOLLECTION}`,
        { name: collectionValue },
        { headers }
      );

      if (response.data.status === 'success') {
        console.log('Collection created:', response.data.data.collection);
        // Add any additional success handling here
        handleCloseAddCollection(); // Close the modal on success
      } else {
        console.error('Failed to create collection:', response.data.message);
      }
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };
  return (
    <div
      className={isDarkMode ? styles.modalOverlay : styles['d-modalOverlay']}
      onClick={handleCloseAddCollection}
    >
      <div
        className={isDarkMode ? styles.modalContainer : styles['d-modalContainer']}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.savedTexxtContainer}>
              <p className={isDarkMode ? styles.saveText : styles['d-saveText']}>
                Add your collection name
              </p>
            </div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.savedIconContainer} onClick={handleCloseAddCollection}>
              <img
                src={isDarkMode ? '/lightIcon/closeModalLight.svg' : '/darkIcon/closeModalDark.svg'}
                className={styles.icon}
              />
            </div>
          </div>
        </div>

        <div className={isDarkMode ? styles.inputBoxContainer : styles['d-inputBoxContainer']}>
          <input
            placeholder="Enter Collection Name"
            className={isDarkMode ? styles.inputBox : styles['d-inputBox']}
            value={collectionValue}
            onChange={handleCollectionInput}
          />
        </div>

        <div className={styles.header}>
          {collectionValue.length > 0 ? (
            <button className={styles.doneBtn} onClick={createCollection}>
              Done!
            </button>
          ) : (
            <button className={styles.doneBtn} style={{ background: '#8C7DC1', cursor: 'no-drop' }}>
              Done!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCollectionModal;
