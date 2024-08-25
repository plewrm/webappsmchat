import React from 'react';
import styles from './SaveCollection.module.css';
import { useTheme } from '../../../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { setUnSavePosts } from '../../../../redux/slices/modalSlice';
import axios from 'axios';
import { BASE_URL, BEARER_TOKEN, UNSAVE_SINGLEPOST } from '../../../../api/EndPoint';

const UnSavePostModal = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const selectedPost = useSelector((state) => state.modal.selectedPost);
  const handleCloseUnSaveModal = () => {
    dispatch(setUnSavePosts(false));
  };

  const handleDeletePost = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN || sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const { hash: postHash, author } = selectedPost;
      const postAuthor = author.soconId;
      if (!postAuthor || !postHash) {
        alert('Invalid post details');
        return;
      }

      const response = await axios.delete(
        `${BASE_URL}${UNSAVE_SINGLEPOST}/posts/${postAuthor}/${postHash}`,
        { headers }
      );

      if (response.status === 200) {
        console.log('unSave sucessfully');
        handleCloseUnSaveModal();
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      alert('An error occurred while deleting the post');
      console.error(error);
    }
  };

  return (
    <div
      className={isDarkMode ? styles.modalOverlay : styles['d-modalOverlay']}
      onClick={handleCloseUnSaveModal}
    >
      <div
        className={isDarkMode ? styles.modalContainer : styles['d-modalContainer']}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.confirmationTittle}>
          <p className={isDarkMode ? styles.confirmationText : styles['d-confirmationText']}>
            Are you sure you want to remove Saved Post ?
          </p>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.cancelButton} onClick={handleCloseUnSaveModal}>
            Cancel
          </button>
          <button
            className={isDarkMode ? styles.sureButton : styles['d-sureButton']}
            onClick={handleDeletePost}
          >
            Yes, Sure
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnSavePostModal;
