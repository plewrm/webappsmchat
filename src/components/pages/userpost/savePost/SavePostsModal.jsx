import React, { useEffect, useState } from 'react';
import styles from './SavePostsModal.module.css';
import { useTheme } from '../../../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { setAddCollectionModal, setSavePostModal } from '../../../../redux/slices/modalSlice';
import ImageCarousel from '../ImageCarousel';
import {
  ADDPOSTTOCOLLECTIONS,
  BASE_URL,
  BEARER_TOKEN,
  GETUSERCOLLECTION
} from '../../../../api/EndPoint';
import axios from 'axios';

const SavePostsModal = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const selectedPost = useSelector((state) => state.modal.selectedPost);
  const [collections, setCollections] = useState([]);
  const [savedCollections, setSavedCollections] = useState([]);

  const handleOpenAddCollection = () => {
    dispatch(setSavePostModal(false));
    dispatch(setAddCollectionModal(true));
  };

  const handleCloseSaveModal = () => {
    dispatch(setSavePostModal(false));
  };

  const fetchCollections = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(
        `${BASE_URL}${GETUSERCOLLECTION}?postAuthor=${selectedPost.author.soconId}&postHash=${selectedPost.hash}`,
        { headers }
      );

      if (response.data.status === 'success') {
        setCollections(response.data.data.collections.reverse());
        setSavedCollections(response.data.data.savedCollections || []);
      } else {
        console.error('Failed to fetch collections:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const savePostToCollection = async (collectionName) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const requestBody = {
        postHash: selectedPost.hash,
        postAuthor: selectedPost.author.soconId,
        moveFromCollection: collectionName !== 'All' ? 'All' : undefined
      };

      const encodedCollectionName = encodeURIComponent(collectionName);
      const url = `${BASE_URL}${ADDPOSTTOCOLLECTIONS}/${encodedCollectionName}`;

      const response = await axios.post(url, requestBody, { headers });

      if (response.status === 201) {
        console.log('Post added to collection successfully');
        setSavedCollections([...savedCollections, collectionName]);
      } else if (response.status === 200) {
        console.log('Post already saved in collection');
      }
    } catch (error) {
      console.error('Error saving post to collection:', error);
      console.error('Error response:', error.response);
      console.error('Error config:', error.config);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);
  return (
    <div
      className={isDarkMode ? styles.modalOverlay : styles['d-modalOverlay']}
      onClick={handleCloseSaveModal}
    >
      <div
        className={isDarkMode ? styles.modalContainer : styles['d-modalContainer']}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.saveImageContainer}>
              {selectedPost.images.length > 0 ? (
                <ImageCarousel
                  images={[selectedPost.images[0].url]}
                  types={[selectedPost.images[0].type]}
                  className={styles.saveImage}
                />
              ) : (
                <img src="/Images/skelation.svg" className={styles.saveImage} />
              )}
            </div>
            <div className={styles.savedTexxtContainer}>
              <p className={isDarkMode ? styles.saveText : styles['d-saveText']}>Saved!</p>
            </div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.savedIconContainer}>
              <img src="/icon/SavedIcon.svg" className={styles.icon} />
            </div>
          </div>
        </div>

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.savedTexxtContainer}>
              <p className={isDarkMode ? styles.saveText : styles['d-saveText']}>Collections</p>
            </div>
          </div>

          <div className={styles.headerRight} onClick={handleOpenAddCollection}>
            <div className={styles.newTextContainer}>
              <p className={styles.newText}>New</p>
            </div>
            <div className={styles.savedIconContainer}>
              <img src="/icon/addSquare_save.svg" className={styles.icon} />
            </div>
          </div>
        </div>

        {collections.map((collection) => (
          <div
            className={styles.header}
            key={collection.hash}
            onClick={() => savePostToCollection(collection.name)}
          >
            <div className={styles.headerLeft}>
              <div className={styles.saveImageContainer}>
                {collection.coverPhotos.length > 0 ? (
                  <img
                    src={collection.coverPhotos[0]}
                    alt={collection.name}
                    className={styles.saveImage}
                  />
                ) : (
                  <img src="/Images/skelation.svg" className={styles.saveImage} />
                )}
              </div>
              <div className={styles.savedTexxtContainer}>
                <p className={isDarkMode ? styles.saveText : styles['d-saveText']}>
                  {collection.name}
                </p>
              </div>
            </div>

            <div className={styles.headerRight}>
              <div className={styles.savedIconContainer}>
                {savedCollections.includes(collection.name) ? (
                  <img
                    src={
                      isDarkMode
                        ? '/lightIcon/addedSquare_LWhite.svg'
                        : '/darkIcon/addedSquare_DWhite.svg'
                    }
                    className={styles.icon}
                  />
                ) : (
                  <img
                    src={
                      isDarkMode
                        ? '/lightIcon/addSquare_LWhite.svg'
                        : '/darkIcon/addSquare_DWhite.svg'
                    }
                    className={styles.icon}
                  />
                )}
              </div>
            </div>
          </div>
        ))}

        <div className={styles.header}>
          <button className={styles.doneBtn} onClick={handleCloseSaveModal}>
            Done!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavePostsModal;
